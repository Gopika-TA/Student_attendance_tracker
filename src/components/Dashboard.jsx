import React, { useMemo } from 'react';
import { Icons } from './Icons.jsx';
import { formatFriendlyDate, calculateStudentStats } from '../utils/helpers.js';
import { getTodayDateString, getOffsetDateString } from '../data/sampleData.js';

export default function Dashboard({ students, attendanceData, setCurrentTab, onOpenAddStudent }) {
  const todayStr = getTodayDateString();
  const todayRecords = attendanceData[todayStr] || {};

  // Calculate today's stats
  const totalStudents = students.length;
  let presentToday = 0;
  let absentToday = 0;

  students.forEach((std) => {
    const record = todayRecords[std.id];
    const status = typeof record === 'object' ? record?.status : record;
    if (status === 'Present') presentToday++;
    else if (status === 'Absent') absentToday++;
  });

  const markedToday = presentToday + absentToday;
  const attendanceRateToday = markedToday > 0 ? ((presentToday / markedToday) * 100).toFixed(1) : "0.0";

  // Calculate class-wise stats
  const classBreakdown = useMemo(() => {
    const map = {};
    students.forEach((std) => {
      const cls = std.grade || "Unassigned";
      if (!map[cls]) {
        map[cls] = { total: 0, present: 0, absent: 0 };
      }
      map[cls].total++;
      const record = todayRecords[std.id];
      const status = typeof record === 'object' ? record?.status : record;
      if (status === 'Present') map[cls].present++;
      else if (status === 'Absent') map[cls].absent++;
    });

    return Object.keys(map).map((clsName) => {
      const data = map[clsName];
      const marked = data.present + data.absent;
      const rate = marked > 0 ? Math.round((data.present / marked) * 100) : 0;
      return {
        className: clsName,
        total: data.total,
        present: data.present,
        absent: data.absent,
        rate
      };
    });
  }, [students, todayRecords]);

  // 7-day attendance trend data
  const trendDays = useMemo(() => {
    const list = [];
    for (let i = 6; i >= 0; i--) {
      list.push(getOffsetDateString(i));
    }
    return list.map((dStr) => {
      const dayRec = attendanceData[dStr] || {};
      let p = 0;
      let a = 0;
      students.forEach((std) => {
        const rec = dayRec[std.id];
        const status = typeof rec === 'object' ? rec?.status : rec;
        if (status === 'Present') p++;
        else if (status === 'Absent') a++;
      });
      const tot = p + a;
      const rate = tot > 0 ? Math.round((p / tot) * 100) : 0;
      const parts = dStr.split('-');
      const dt = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      const shortLabel = dt.toLocaleDateString('en-US', { weekday: 'short' });
      return {
        date: dStr,
        shortLabel: dStr === todayStr ? 'Today' : shortLabel,
        present: p,
        absent: a,
        rate
      };
    });
  }, [attendanceData, students, todayStr]);

  // Students with low overall attendance (< 75%)
  const lowAttendanceStudents = useMemo(() => {
    return students
      .map((std) => {
        const stats = calculateStudentStats(std.id, attendanceData);
        return { ...std, stats };
      })
      .filter((std) => std.stats.totalRecorded > 0 && std.stats.percentage < 75)
      .sort((a, b) => a.stats.percentage - b.stats.percentage);
  }, [students, attendanceData]);

  // Recent attendance history for past 5 dates
  const recentDays = useMemo(() => {
    const dates = Object.keys(attendanceData)
      .sort((a, b) => b.localeCompare(a))
      .slice(0, 5);

    return dates.map((dateKey) => {
      const dayRec = attendanceData[dateKey] || {};
      let pCount = 0;
      let aCount = 0;
      students.forEach((std) => {
        const rec = dayRec[std.id];
        const status = typeof rec === 'object' ? rec?.status : rec;
        if (status === 'Present') pCount++;
        else if (status === 'Absent') aCount++;
      });
      const total = pCount + aCount;
      const rate = total > 0 ? ((pCount / total) * 100).toFixed(0) : "0";
      return {
        date: dateKey,
        friendlyDate: formatFriendlyDate(dateKey),
        present: pCount,
        absent: aCount,
        rate
      };
    });
  }, [attendanceData, students]);

  return (
    <div className="dashboard-content">
      {/* Welcome Banner */}
      <div className="dashboard-welcome">
        <div className="welcome-text">
          <h3>Welcome to AttendTrack Portal 👋</h3>
          <p>
            Track daily classroom attendance, monitor student consistency, and generate detailed percentage reports with ease.
          </p>
        </div>
        <div className="welcome-actions">
          <button className="btn-welcome-light" onClick={() => setCurrentTab('attendance')}>
            <Icons.Check />
            <span>Mark Today's Attendance</span>
          </button>
          <button className="btn-welcome-outline" onClick={onOpenAddStudent}>
            <Icons.Plus />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Total Students</span>
            <span className="metric-value">{totalStudents}</span>
            <span className="metric-sub">
              <span>Enrolled in directory</span>
            </span>
          </div>
          <div className="metric-icon-box icon-blue">
            <Icons.Students />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Present Today</span>
            <span className="metric-value" style={{ color: 'var(--success)' }}>{presentToday}</span>
            <span className="metric-sub">
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>Active in classes</span>
            </span>
          </div>
          <div className="metric-icon-box icon-green">
            <Icons.UserCheck />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Absent Today</span>
            <span className="metric-value" style={{ color: 'var(--danger)' }}>{absentToday}</span>
            <span className="metric-sub">
              <span style={{ color: 'var(--danger)', fontWeight: 600 }}>Marked absent</span>
            </span>
          </div>
          <div className="metric-icon-box icon-red">
            <Icons.UserX />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Attendance Rate</span>
            <span className="metric-value">{attendanceRateToday}%</span>
            <span className="metric-sub">
              <span>Today's ratio ({presentToday}/{markedToday || totalStudents})</span>
            </span>
          </div>
          <div className="metric-icon-box icon-purple">
            <Icons.TrendingUp />
          </div>
        </div>
      </div>

      {/* Middle Two-Column Grid */}
      <div className="dashboard-grid-two-col">
        {/* Visual Ratio, Trend Chart & Class Stats */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <h4>Today's Attendance Overview</h4>
              <p>Visual status distribution for {formatFriendlyDate(todayStr)}</p>
            </div>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setCurrentTab('attendance')}>
              View Sheet
            </button>
          </div>
          <div className="card-body">
            <div className="visual-progress-section">
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill-present"
                  style={{ width: `${Math.max(parseFloat(attendanceRateToday), 5)}%` }}
                >
                  {attendanceRateToday}%
                </div>
              </div>
              <div className="progress-legend">
                <div className="legend-item">
                  <span className="legend-color-dot dot-green"></span>
                  <span>Present: {presentToday} students</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color-dot dot-red"></span>
                  <span>Absent: {absentToday} students</span>
                </div>
              </div>
            </div>

            {/* 7-Day Attendance Trend Chart */}
            <div className="trend-chart-container">
              <div className="chart-header">
                <div className="chart-title">7-Day Attendance Trend</div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Daily turnout %</span>
              </div>
              <div className="bars-wrapper">
                {trendDays.map((td) => (
                  <div 
                    key={td.date} 
                    className="bar-col" 
                    title={`${td.date}: ${td.present} Present, ${td.absent} Absent (${td.rate}%)`}
                    onClick={() => setCurrentTab('attendance')}
                  >
                    <div className="bar-rate-tag">{td.rate}%</div>
                    <div className="bar-track">
                      <div 
                        className={`bar-fill ${td.rate >= 80 ? 'high' : td.rate >= 70 ? 'medium' : 'low'}`}
                        style={{ height: `${Math.max(td.rate, 6)}%` }}
                      />
                    </div>
                    <span className="bar-label">{td.shortLabel}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <h5 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)' }}>
                Class Breakdown
              </h5>
              <div className="class-stat-list">
                {classBreakdown.map((item) => (
                  <div key={item.className} className="class-stat-row">
                    <div>
                      <div className="class-stat-name">{item.className}</div>
                      <div className="class-stat-count">{item.present} Present / {item.absent} Absent ({item.total} total)</div>
                    </div>
                    <span className={`class-rate-badge ${item.rate >= 80 ? 'rate-high' : item.rate >= 70 ? 'rate-medium' : 'rate-low'}`}>
                      {item.rate}% Present
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Low Attendance Alert Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--danger)' }}><Icons.AlertTriangle /></span>
                <span>Low Attendance Alert</span>
              </h4>
              <p>Students with overall rate below 75%</p>
            </div>
          </div>
          <div className="card-body">
            {lowAttendanceStudents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--success)' }}>
                <Icons.Check />
                <p style={{ marginTop: '8px', fontSize: '0.9rem', fontWeight: 600 }}>All students are above 75% attendance!</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Great consistency across classes.</p>
              </div>
            ) : (
              <div className="alert-student-list">
                {lowAttendanceStudents.map((std) => (
                  <div key={std.id} className="alert-student-item">
                    <div className="alert-student-info">
                      <div className="alert-student-avatar">
                        {std.name.charAt(0)}
                      </div>
                      <div>
                        <div className="alert-student-name">{std.name}</div>
                        <div className="alert-student-meta">Roll #{std.rollNumber} • {std.grade}</div>
                      </div>
                    </div>
                    <div className="alert-rate-tag">
                      {std.stats.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button 
              className="btn-secondary" 
              style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}
              onClick={() => setCurrentTab('reports')}
            >
              Open Full Attendance Reports
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <h4>Recent Attendance Logs</h4>
            <p>Summary of past recorded school days</p>
          </div>
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setCurrentTab('attendance')}>
            Open Attendance Book
          </button>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Present Count</th>
                <th>Absent Count</th>
                <th>Overall Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentDays.map((row) => (
                <tr key={row.date}>
                  <td>
                    <strong>{row.friendlyDate}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.date}</div>
                  </td>
                  <td>
                    <span className="badge badge-present">{row.present} Present</span>
                  </td>
                  <td>
                    <span className="badge badge-absent">{row.absent} Absent</span>
                  </td>
                  <td>
                    <strong>{row.rate}%</strong>
                  </td>
                  <td>
                    <span className={`class-rate-badge ${parseInt(row.rate) >= 80 ? 'rate-high' : 'rate-medium'}`}>
                      {parseInt(row.rate) >= 80 ? 'Normal Attendance' : 'Lower Turnout'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

