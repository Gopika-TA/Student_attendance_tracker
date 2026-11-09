import React, { useState, useMemo } from 'react';
import { Icons } from './Icons.jsx';
import { formatFriendlyDate } from '../utils/helpers.js';
import { getTodayDateString } from '../data/sampleData.js';

export default function Attendance({ students, attendanceData, onSaveAttendance, showToast }) {
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Get current day records from props
  const dateRecord = attendanceData[selectedDate] || {};

  // Get unique classes
  const classes = useMemo(() => {
    const list = Array.from(new Set(students.map((s) => s.grade || "Unassigned")));
    list.sort();
    return list;
  }, [students]);

  // Filter students for the table
  const displayedStudents = useMemo(() => {
    return students.filter((std) => {
      const matchSearch =
        std.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        std.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchClass = selectedClass === "ALL" || std.grade === selectedClass;
      return matchSearch && matchClass;
    });
  }, [students, searchTerm, selectedClass]);

  // Stats for the chosen date
  const dateStats = useMemo(() => {
    let present = 0;
    let absent = 0;
    let unmarked = 0;

    students.forEach((std) => {
      const rec = dateRecord[std.id];
      const status = typeof rec === 'object' ? rec?.status : rec;
      if (status === 'Present') present++;
      else if (status === 'Absent') absent++;
      else unmarked++;
    });

    const total = students.length;
    const marked = present + absent;
    const rate = marked > 0 ? ((present / marked) * 100).toFixed(1) : "0.0";

    return { total, present, absent, unmarked, rate };
  }, [students, dateRecord]);

  // Handle single student status toggle
  const handleToggleStatus = (studentId, newStatus) => {
    const existing = dateRecord[studentId];
    const oldRemark = typeof existing === 'object' ? existing?.remark || "" : "";

    const updatedDateRecords = {
      ...dateRecord,
      [studentId]: {
        status: newStatus,
        remark: oldRemark
      }
    };

    onSaveAttendance(selectedDate, updatedDateRecords);
  };

  // Handle remark change
  const handleRemarkChange = (studentId, remarkText) => {
    const existing = dateRecord[studentId];
    const currentStatus = typeof existing === 'object' ? existing?.status : existing || 'Present';

    const updatedDateRecords = {
      ...dateRecord,
      [studentId]: {
        status: currentStatus,
        remark: remarkText
      }
    };

    onSaveAttendance(selectedDate, updatedDateRecords);
  };

  // Bulk: Mark All Present
  const handleMarkAllPresent = () => {
    const updated = { ...dateRecord };
    displayedStudents.forEach((std) => {
      const existing = updated[std.id];
      const remark = typeof existing === 'object' ? existing?.remark || "" : "";
      updated[std.id] = { status: "Present", remark };
    });
    onSaveAttendance(selectedDate, updated);
    showToast(`Marked ${displayedStudents.length} students Present for ${selectedDate}`, 'success');
  };

  // Bulk: Mark All Absent
  const handleMarkAllAbsent = () => {
    const updated = { ...dateRecord };
    displayedStudents.forEach((std) => {
      const existing = updated[std.id];
      const remark = typeof existing === 'object' ? existing?.remark || "" : "";
      updated[std.id] = { status: "Absent", remark };
    });
    onSaveAttendance(selectedDate, updated);
    showToast(`Marked ${displayedStudents.length} students Absent for ${selectedDate}`, 'danger');
  };

  // Export Daily Register to CSV
  const handleExportDailySheet = () => {
    const headers = ["Date", "Roll Number", "Student Name", "Class", "Status", "Remarks"];
    const rows = displayedStudents.map((std) => {
      const rec = dateRecord[std.id];
      const status = typeof rec === 'object' ? rec?.status : rec || "Unmarked";
      const remark = typeof rec === 'object' ? rec?.remark || "" : "";
      return [
        selectedDate,
        std.rollNumber,
        `"${std.name}"`,
        `"${std.grade}"`,
        status,
        `"${remark}"`
      ];
    });

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Daily_Attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported register for ${selectedDate}`, 'success');
  };

  // Date steppers
  const handleStepDay = (step) => {
    const parts = selectedDate.split('-');
    const cur = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    cur.setDate(cur.getDate() + step);
    const yr = cur.getFullYear();
    const mo = String(cur.getMonth() + 1).padStart(2, '0');
    const da = String(cur.getDate()).padStart(2, '0');
    setSelectedDate(`${yr}-${mo}-${da}`);
  };

  return (
    <div className="attendance-content">
      {/* Date Control Panel */}
      <div className="attendance-control-panel">
        <div className="attendance-date-row">
          <div className="date-picker-group">
            <span className="date-label">Attendance Date:</span>
            <input
              type="date"
              className="date-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button 
              className={`btn-date-nav ${selectedDate === getTodayDateString() ? 'active' : ''}`}
              onClick={() => setSelectedDate(getTodayDateString())}
            >
              Today
            </button>
            <button 
              className="btn-date-nav"
              onClick={() => handleStepDay(-1)}
              title="Previous Day"
            >
              ◀ Prev
            </button>
            <button 
              className="btn-date-nav"
              onClick={() => handleStepDay(1)}
              title="Next Day"
            >
              Next ▶
            </button>
            <span style={{ fontWeight: 600, color: 'var(--text-main)', marginLeft: '6px' }}>
              {formatFriendlyDate(selectedDate)}
            </span>
          </div>

          <div className="bulk-actions-group">
            <button className="btn-bulk-present" onClick={handleMarkAllPresent}>
              <Icons.Check />
              <span>Mark All Present</span>
            </button>
            <button className="btn-bulk-absent" onClick={handleMarkAllAbsent}>
              <Icons.X />
              <span>Mark All Absent</span>
            </button>
          </div>
        </div>

        {/* Date Statistics Bar */}
        <div className="attendance-summary-bar">
          <div className="summary-stat-box">
            <span className="summary-stat-label">Total Students</span>
            <span className="summary-stat-val">{dateStats.total}</span>
          </div>
          <div className="summary-stat-box">
            <span className="summary-stat-label">Present</span>
            <span className="summary-stat-val val-green">{dateStats.present}</span>
          </div>
          <div className="summary-stat-box">
            <span className="summary-stat-label">Absent</span>
            <span className="summary-stat-val val-red">{dateStats.absent}</span>
          </div>
          <div className="summary-stat-box">
            <span className="summary-stat-label">Attendance Rate</span>
            <span className="summary-stat-val val-purple">{dateStats.rate}%</span>
          </div>
        </div>
      </div>

      {/* Filters & Daily Sheet Actions */}
      <div className="page-toolbar">
        <div className="search-filter-group">
          <div className="search-box">
            <span className="search-icon-inside"><Icons.Search /></span>
            <input
              type="text"
              placeholder="Filter student list..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="ALL">All Classes</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div className="toolbar-actions">
          <button className="btn-secondary" onClick={handleExportDailySheet} title="Export this date register">
            <Icons.Download />
            <span>Export Day CSV</span>
          </button>
          <button className="btn-secondary" onClick={() => window.print()} title="Print this date register">
            <Icons.Printer />
            <span>Print Register</span>
          </button>
        </div>
      </div>

      {/* Attendance Sheet Table */}
      <div className="attendance-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Roll No</th>
              <th>Class</th>
              <th>Mark Attendance</th>
              <th>Remark / Notes (Optional)</th>
            </tr>
          </thead>
          <tbody>
            {displayedStudents.map((std) => {
              const record = dateRecord[std.id];
              const status = typeof record === 'object' ? record?.status : record;
              const remark = typeof record === 'object' ? record?.remark || "" : "";

              return (
                <tr key={std.id}>
                  <td>
                    <div className="student-meta-cell">
                      <div className="student-avatar">{std.name.charAt(0)}</div>
                      <span className="student-name-text">{std.name}</span>
                    </div>
                  </td>
                  <td>
                    <strong>#{std.rollNumber}</strong>
                  </td>
                  <td>
                    <span className="badge badge-class">{std.grade}</span>
                  </td>
                  <td>
                    <div className="attendance-toggle-group">
                      <button
                        className={`btn-toggle-status ${status === 'Present' ? 'active-present' : ''}`}
                        onClick={() => handleToggleStatus(std.id, 'Present')}
                      >
                        <Icons.Check />
                        <span>Present</span>
                      </button>
                      <button
                        className={`btn-toggle-status ${status === 'Absent' ? 'active-absent' : ''}`}
                        onClick={() => handleToggleStatus(std.id, 'Absent')}
                      >
                        <Icons.X />
                        <span>Absent</span>
                      </button>
                    </div>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="notes-input"
                      placeholder="e.g. Fever, Sports..."
                      value={remark}
                      onChange={(e) => handleRemarkChange(std.id, e.target.value)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

