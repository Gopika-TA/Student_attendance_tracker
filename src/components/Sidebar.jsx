import React, { useRef } from 'react';
import { Icons } from './Icons.jsx';

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  studentCount, 
  mobileOpen, 
  setMobileOpen, 
  onResetDemo, 
  onExportBackup, 
  onImportBackup 
}) {
  const fileInputRef = useRef(null);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <Icons.Dashboard /> },
    { id: "students", label: "Students", icon: <Icons.Students />, badge: studentCount },
    { id: "attendance", label: "Attendance", icon: <Icons.Attendance /> },
    { id: "reports", label: "Reports", icon: <Icons.Reports /> }
  ];

  return (
    <>
      <div 
        className={`sidebar-backdrop ${mobileOpen ? 'mobile-open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon-wrapper">
            <Icons.GraduationCap />
          </div>
          <div className="brand-text">
            <h1>AttendTrack</h1>
            <span>School Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Navigation</div>
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileOpen(false);
                }}
              >
                <div className="nav-item-left">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="system-status-card">
            <div className="status-header">
              <span className="status-indicator-dot"></span>
              <span>Local Database Active</span>
            </div>
            <div className="status-desc">
              Persistent storage in browser localStorage.
            </div>

            <div className="sidebar-btn-group" style={{ marginTop: '10px' }}>
              <button 
                onClick={onExportBackup}
                className="sidebar-action-btn"
                title="Download JSON backup"
              >
                <Icons.Download /> Backup
              </button>
              <button 
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="sidebar-action-btn"
                title="Restore from JSON backup"
              >
                <Icons.Upload /> Restore
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept=".json"
                onChange={onImportBackup} 
              />
            </div>

            <button 
              onClick={onResetDemo}
              className="btn-secondary" 
              style={{ width: '100%', marginTop: '8px', padding: '6px 10px', fontSize: '0.78rem', justifyContent: 'center' }}
              title="Reset students and sample attendance"
            >
              <Icons.Refresh /> Reset Demo Data
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

