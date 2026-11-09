import React, { useState, useMemo } from 'react';
import { Icons } from './Icons.jsx';
import { calculateStudentStats } from '../utils/helpers.js';

export default function Students({ 
  students, 
  attendanceData, 
  onAddStudent, 
  onEditStudent, 
  onDeleteStudent, 
  onViewStudent 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("ALL");

  // Get unique classes
  const classes = useMemo(() => {
    const list = Array.from(new Set(students.map((s) => s.grade || "Unassigned")));
    list.sort();
    return list;
  }, [students]);

  // Filter students based on search and class filter
  const filteredStudents = useMemo(() => {
    return students.filter((std) => {
      const matchSearch = 
        std.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        std.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (std.email && std.email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchClass = selectedClass === "ALL" || std.grade === selectedClass;
      return matchSearch && matchClass;
    });
  }, [students, searchTerm, selectedClass]);

  return (
    <div className="students-content">
      {/* Search & Actions Toolbar */}
      <div className="page-toolbar">
        <div className="search-filter-group">
          <div className="search-box">
            <span className="search-icon-inside"><Icons.Search /></span>
            <input
              type="text"
              placeholder="Search by student name, roll number..."
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
            <option value="ALL">All Classes ({students.length})</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div className="toolbar-actions">
          <button className="btn-primary" onClick={onAddStudent}>
            <Icons.Plus />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Students Data Table */}
      {filteredStudents.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon-wrapper">
              <Icons.Students />
            </div>
            <h4>No Students Found</h4>
            <p>
              {searchTerm || selectedClass !== "ALL"
                ? "No students match your search criteria. Try clearing the search filter."
                : "Your student roster is currently empty. Click below to add your first student."}
            </p>
            {searchTerm || selectedClass !== "ALL" ? (
              <button 
                className="btn-secondary" 
                onClick={() => { setSearchTerm(""); setSelectedClass("ALL"); }}
              >
                Clear Search
              </button>
            ) : (
              <button className="btn-primary" onClick={onAddStudent}>
                <Icons.Plus /> Add First Student
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No</th>
                <th>Class / Grade</th>
                <th>Contact Info</th>
                <th>Attendance</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((std) => {
                const stats = calculateStudentStats(std.id, attendanceData);
                return (
                  <tr key={std.id}>
                    <td>
                      <div className="student-meta-cell">
                        <div className="student-avatar">
                          {std.name.charAt(0)}
                        </div>
                        <div>
                          <span className="student-name-text">{std.name}</span>
                          <span className="student-id-text">{std.gender || "Student"}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong>#{std.rollNumber}</strong>
                    </td>
                    <td>
                      <span className="badge badge-class">{std.grade}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem' }}>
                        <div>{std.email || "No email"}</div>
                        <div style={{ color: 'var(--text-muted)' }}>{std.phone || "No phone"}</div>
                      </div>
                    </td>
                    <td>
                      <div className="report-table-progress">
                        <div className="table-progress-bar">
                          <div
                            className={`table-progress-fill ${stats.statusColor}`}
                            style={{ width: `${Math.max(stats.percentage, 5)}%` }}
                          />
                        </div>
                        <span className="percentage-text">{stats.percentage}%</span>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                        <button 
                          className="btn-icon-action" 
                          onClick={() => onViewStudent(std)}
                          title="View Attendance History"
                        >
                          <Icons.Eye />
                        </button>
                        <button 
                          className="btn-icon-action" 
                          onClick={() => onEditStudent(std)}
                          title="Edit Student"
                        >
                          <Icons.Edit />
                        </button>
                        <button 
                          className="btn-icon-action delete" 
                          onClick={() => onDeleteStudent(std)}
                          title="Delete Student"
                        >
                          <Icons.Trash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

