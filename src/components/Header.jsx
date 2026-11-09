import React from 'react';
import { Icons } from './Icons.jsx';
import { formatFriendlyDate } from '../utils/helpers.js';
import { getTodayDateString } from '../data/sampleData.js';

export default function Header({ 
  currentTab, 
  setMobileOpen, 
  onOpenAddStudent, 
  setCurrentTab, 
  theme, 
  onToggleTheme 
}) {
  const getHeaderInfo = () => {
    switch (currentTab) {
      case "dashboard":
        return { title: "Dashboard Overview", subtitle: "Real-time attendance insights & key classroom metrics" };
      case "students":
        return { title: "Student Directory", subtitle: "Manage enrolled students, profiles, and contact details" };
      case "attendance":
        return { title: "Mark Attendance", subtitle: "Select a date and record classroom attendance status" };
      case "reports":
        return { title: "Attendance Reports", subtitle: "Performance analytics, percentage tracking & student reports" };
      default:
        return { title: "Attendance Tracker", subtitle: "Manage your class attendance" };
    }
  };

  const { title, subtitle } = getHeaderInfo();
  const todayFormatted = formatFriendlyDate(getTodayDateString());

  return (
    <header className="top-header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)} title="Open Menu">
          <Icons.Menu />
        </button>
        <div className="page-titles">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="header-right">
        {/* Dark / Light Mode Toggle Button */}
        <button 
          className="theme-toggle-btn" 
          onClick={onToggleTheme} 
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
        </button>

        <div className="date-badge">
          <Icons.Calendar />
          <span>{todayFormatted}</span>
        </div>

        {currentTab === 'students' ? (
          <button className="quick-action-btn" onClick={onOpenAddStudent}>
            <Icons.Plus />
            <span>Add Student</span>
          </button>
        ) : (
          <button 
            className="quick-action-btn" 
            onClick={() => setCurrentTab('attendance')}
            title="Mark today's attendance"
          >
            <Icons.Attendance />
            <span>Mark Today</span>
          </button>
        )}
      </div>
    </header>
  );
}

