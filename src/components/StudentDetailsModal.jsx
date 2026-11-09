import React from 'react';
import { Icons } from './Icons.jsx';
import { calculateStudentStats, formatFriendlyDate } from '../utils/helpers.js';

export default function StudentDetailsModal({ student, attendanceData, onClose }) {
  if (!student) return null;

  const stats = calculateStudentStats(student.id, attendanceData);

  // Collect history
  const history = Object.keys(attendanceData)
    .sort((a, b) => b.localeCompare(a))
    .filter((d) => attendanceData[d] && attendanceData[d][student.id])
    .map((dateKey) => {
      const rec = attendanceData[dateKey][student.id];
      const status = typeof rec === 'object' ? rec?.status : rec;
      const remark = typeof rec === 'object' ? rec?.remark : "";
      return {
        date: dateKey,
        friendlyDate: formatFriendlyDate(dateKey),
        status,
        remark
      };
    });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="student-avatar" style={{ width: '42px', height: '42px', fontSize: '1.1rem' }}>
              {student.name.charAt(0)}
            </div>
            <div>
              <h3>{student.name}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Roll #{student.rollNumber} • {student.grade}</p>
            </div>
          </div>
          <button className="btn-modal-close" onClick={onClose}><Icons.X /></button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Summary Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: 'var(--bg-app)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL DAYS</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{stats.totalRecorded}</div>
            </div>
            <div style={{ backgroundColor: 'var(--success-light)', padding: '12px', borderRadius: '8px', textAlign: 'center', color: 'var(--success-hover)' }}>
              <div style={{ fontSize: '0.75rem' }}>PRESENT</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{stats.presentDays}</div>
            </div>
            <div style={{ backgroundColor: 'var(--danger-light)', padding: '12px', borderRadius: '8px', textAlign: 'center', color: 'var(--danger-hover)' }}>
              <div style={{ fontSize: '0.75rem' }}>ABSENT</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{stats.absentDays}</div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
              <span>Attendance Consistency</span>
              <span>{stats.percentage}% ({stats.statusCategory})</span>
            </div>
            <div className="table-progress-bar" style={{ height: '10px' }}>
              <div className={`table-progress-fill ${stats.statusColor}`} style={{ width: `${Math.max(stats.percentage, 5)}%` }} />
            </div>
          </div>

          {/* Past History Table */}
          <h5 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px' }}>Attendance Log History</h5>
          <div style={{ maxHeight: '240px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '8px' }}>
            {history.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No attendance recorded yet for this student.
              </div>
            ) : (
              <table className="data-table" style={{ fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.date}>
                      <td>{h.friendlyDate}</td>
                      <td>
                        <span className={`badge ${h.status === 'Present' ? 'badge-present' : 'badge-absent'}`}>
                          {h.status}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{h.remark || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

