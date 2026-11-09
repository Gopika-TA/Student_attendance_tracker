import React, { useState, useMemo } from 'react';
import { Icons } from './Icons.jsx';
import { calculateStudentStats } from '../utils/helpers.js';
import { getTodayDateString, getOffsetDateString } from '../data/sampleData.js';

export default function Reports({ students, attendanceData, onViewStudent }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [timeframe, setTimeframe] = useState("ALL");

  // Determine active date filter set based on timeframe
  const activeDateSet = useMemo(() => {
    if (timeframe === "ALL") return null;

    const set = new Set();
    const today = new Date();

    if (timeframe === "7DAYS") {
      for (let i = 0; i < 7; i++) set.add(getOffsetDateString(i));
    } else if (timeframe === "30DAYS") {
      for (let i = 0; i < 30; i++) set.add(getOffsetDateString(i));
    } else if (timeframe === "THIS_MONTH") {
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const prefix = `${year}-${month}`;
      Object.keys(attendanceData).forEach((d) => {
        if (d.startsWith(prefix)) set.add(d);
      });
    }

    return set;
  }, [timeframe, attendanceData]);

  // Calculate statistics for each student
  const studentReports = useMemo(() => {
    return students.map((std) => {
      const stats = calculateStudentStats(std.id, attendanceData, activeDateSet);
      return {
        ...std,
        ...stats
      };
    });
  }, [students, attendanceData, activeDateSet]);

  // Overall aggregate metrics
  const aggregateMetrics = useMemo(() => {
    let totalPercents = 0;
    let studentsCount = 0;
    let highCount = 0;
    let lowCount = 0;

    studentReports.forEach((s) => {
      if (s.totalRecorded > 0) {
        totalPercents += s.percentage;
        studentsCount++;
        if (s.percentage >= 85) highCount++;
        else if (s.percentage < 75) lowCount++;
      }
    });

    const averageRate = studentsCount > 0 ? (totalPercents / studentsCount).toFixed(1) : "0.0";
    return { averageRate, highCount, lowCount, totalStudents: students.length };
  }, [studentReports, students]);

  // Filter list
  const filteredReports = useMemo(() => {
    return studentReports.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchClass = selectedClass === "ALL" || item.grade === selectedClass;
      let matchStatus = true;
      if (statusFilter === "EXCELLENT") matchStatus = item.percentage >= 85;
      else if (statusFilter === "GOOD") matchStatus = item.percentage >= 75 && item.percentage < 85;
      else if (statusFilter === "WARNING") matchStatus = item.percentage < 75;

      return matchSearch && matchClass && matchStatus;
    });
  }, [studentReports, searchTerm, selectedClass, statusFilter]);

  // Classes list
  const classes = useMemo(() => {
    const list = Array.from(new Set(students.map((s) => s.grade || "Unassigned")));
    list.sort();
    return list;
  }, [students]);

  // CSV Export feature
  const exportToCSV = () => {
    const headers = ["Roll Number", "Student Name", "Class", "Total Recorded Days", "Days Present", "Days Absent", "Attendance %", "Status"];
    const rows = filteredReports.map((r) => [
      r.rollNumber,
      `"${r.name}"`,
      `"${r.grade}"`,
      r.totalRecorded,
      r.presentDays,
      r.absentDays,
      `${r.percentage}%`,
      r.statusCategory
    ]);

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Attendance_Report_${getTodayDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Report feature
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="reports-content">
      {/* 3 Summary Cards */}
      <div className="report-overview-cards">
        <div className="report-summary-card">
          <div className="report-summary-icon icon-blue">
            <Icons.TrendingUp />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>CLASSROOM AVERAGE</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{aggregateMetrics.averageRate}%</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Across active timeframe</div>
          </div>
        </div>

        <div className="report-summary-card">
          <div className="report-summary-icon icon-green">
            <Icons.UserCheck />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>EXCELLENT (≥85%)</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)' }}>{aggregateMetrics.highCount}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>High consistency students</div>
          </div>
        </div>

        <div className="report-summary-card">
          <div className="report-summary-icon icon-red">
            <Icons.AlertTriangle />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>NEEDS ATTENTION (&lt;75%)</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--danger)' }}>{aggregateMetrics.lowCount}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Below attendance threshold</div>
          </div>
        </div>
      </div>

      {/* Toolbar Filters & Export Buttons */}
      <div className="page-toolbar">
        <div className="search-filter-group">
          <div className="search-box">
            <span className="search-icon-inside"><Icons.Search /></span>
            <input
              type="text"
              placeholder="Search reports by student name, roll #..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            title="Filter by time range"
          >
            <option value="ALL">All Time</option>
            <option value="7DAYS">Last 7 Days</option>
            <option value="30DAYS">Last 30 Days</option>
            <option value="THIS_MONTH">This Month</option>
          </select>

          <select
            className="filter-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="ALL">All Classes</option>
            {classes.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="EXCELLENT">Excellent (≥85%)</option>
            <option value="GOOD">Good (75%-84%)</option>
            <option value="WARNING">Needs Attention (&lt;75%)</option>
          </select>
        </div>

        <div className="toolbar-actions">
          <button className="btn-secondary" onClick={exportToCSV}>
            <Icons.Download />
            <span>Export CSV</span>
          </button>
          <button className="btn-secondary" onClick={handlePrint}>
            <Icons.Printer />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Detailed Reports Table */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Roll #</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Working Days</th>
              <th>Days Present</th>
              <th>Days Absent</th>
              <th>Attendance %</th>
              <th>Status Category</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((item) => (
              <tr key={item.id}>
                <td><strong>#{item.rollNumber}</strong></td>
                <td>
                  <div className="student-meta-cell">
                    <div className="student-avatar">{item.name.charAt(0)}</div>
                    <span className="student-name-text">{item.name}</span>
                  </div>
                </td>
                <td><span className="badge badge-class">{item.grade}</span></td>
                <td>{item.totalRecorded} days</td>
                <td><strong style={{ color: 'var(--success)' }}>{item.presentDays}</strong></td>
                <td><strong style={{ color: 'var(--danger)' }}>{item.absentDays}</strong></td>
                <td>
                  <div className="report-table-progress">
                    <div className="table-progress-bar">
                      <div
                        className={`table-progress-fill ${item.statusColor}`}
                        style={{ width: `${Math.max(item.percentage, 5)}%` }}
                      />
                    </div>
                    <span className="percentage-text">{item.percentage}%</span>
                  </div>
                </td>
                <td>
                  <span className={`class-rate-badge ${item.percentage >= 85 ? 'rate-high' : item.percentage >= 75 ? 'rate-medium' : 'rate-low'}`}>
                    {item.statusCategory}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    className="btn-icon-action"
                    onClick={() => onViewStudent(item)}
                    title="View Log History"
                  >
                    <Icons.Eye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

