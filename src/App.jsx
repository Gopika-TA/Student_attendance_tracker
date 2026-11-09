import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Dashboard from './components/Dashboard.jsx';
import Students from './components/Students.jsx';
import Attendance from './components/Attendance.jsx';
import Reports from './components/Reports.jsx';
import StudentModal from './components/StudentModal.jsx';
import StudentDetailsModal from './components/StudentDetailsModal.jsx';
import DeleteConfirmModal from './components/DeleteConfirmModal.jsx';
import ToastContainer from './components/Toast.jsx';

import { 
  SAMPLE_STUDENTS, 
  generateSampleAttendance, 
  getTodayDateString 
} from './data/sampleData.js';
import { STORAGE_KEYS } from './utils/helpers.js';

export default function App() {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Theme state: 'light' or 'dark'
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME || 'sat_theme_v2');
      if (savedTheme) return savedTheme;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {}
    return 'light';
  });

  // Apply theme to document element
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(STORAGE_KEYS.THEME || 'sat_theme_v2', theme);
    } catch (e) {}
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Student list state initialized from localStorage
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load students from localStorage", e);
    }
    return SAMPLE_STUDENTS;
  });

  // Attendance records state initialized from localStorage
  const [attendanceData, setAttendanceData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load attendance from localStorage", e);
    }
    return generateSampleAttendance();
  });

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [studentToView, setStudentToView] = useState(null);

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Save students to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error("Error saving students to localStorage", e);
    }
  }, [students]);

  // Save attendance to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceData));
    } catch (e) {
      console.error("Error saving attendance to localStorage", e);
    }
  }, [attendanceData]);

  // Add or Update student handler
  const handleSaveStudent = (studentData) => {
    if (studentToEdit) {
      setStudents((prev) => prev.map((s) => (s.id === studentData.id ? studentData : s)));
      showToast(`Updated profile for ${studentData.name}`, 'success');
    } else {
      setStudents((prev) => [studentData, ...prev]);
      showToast(`Added new student: ${studentData.name}`, 'success');
    }
    setStudentToEdit(null);
  };

  // Delete student handler
  const handleConfirmDelete = () => {
    if (!studentToDelete) return;
    const name = studentToDelete.name;
    setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
    setStudentToDelete(null);
    showToast(`Removed student ${name} from roster`, 'danger');
  };

  // Save single date attendance records
  const handleSaveAttendance = (dateKey, updatedDateRecords) => {
    setAttendanceData((prev) => ({
      ...prev,
      [dateKey]: updatedDateRecords
    }));
  };

  // Reset to initial demo data
  const handleResetDemo = () => {
    if (window.confirm("Reset all data to default demo students and sample attendance records?")) {
      setStudents(SAMPLE_STUDENTS);
      setAttendanceData(generateSampleAttendance());
      showToast("Restored demo students and sample attendance history!", "info");
    }
  };

  // Export full JSON backup
  const handleExportBackup = () => {
    const backupObj = {
      app: "Student Attendance Tracker",
      version: 2,
      exportedAt: new Date().toISOString(),
      students,
      attendanceData
    };
    const jsonString = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AttendTrack_Backup_${getTodayDateString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloaded attendance database backup!", "success");
  };

  // Import JSON backup
  const handleImportBackup = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed.students) && parsed.attendanceData) {
          setStudents(parsed.students);
          setAttendanceData(parsed.attendanceData);
          showToast(`Successfully restored backup with ${parsed.students.length} students!`, "success");
        } else {
          showToast("Invalid backup file format", "danger");
        }
      } catch (err) {
        showToast("Error parsing backup JSON file", "danger");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="app-container">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        studentCount={students.length}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onResetDemo={handleResetDemo}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          setMobileOpen={setMobileOpen}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenAddStudent={() => {
            setStudentToEdit(null);
            setIsAddEditModalOpen(true);
          }}
        />

        <main className="content-body">
          {currentTab === 'dashboard' && (
            <Dashboard
              students={students}
              attendanceData={attendanceData}
              setCurrentTab={setCurrentTab}
              onOpenAddStudent={() => {
                setStudentToEdit(null);
                setIsAddEditModalOpen(true);
              }}
            />
          )}

          {currentTab === 'students' && (
            <Students
              students={students}
              attendanceData={attendanceData}
              onAddStudent={() => {
                setStudentToEdit(null);
                setIsAddEditModalOpen(true);
              }}
              onEditStudent={(std) => {
                setStudentToEdit(std);
                setIsAddEditModalOpen(true);
              }}
              onDeleteStudent={(std) => setStudentToDelete(std)}
              onViewStudent={(std) => setStudentToView(std)}
            />
          )}

          {currentTab === 'attendance' && (
            <Attendance
              students={students}
              attendanceData={attendanceData}
              onSaveAttendance={handleSaveAttendance}
              showToast={showToast}
            />
          )}

          {currentTab === 'reports' && (
            <Reports
              students={students}
              attendanceData={attendanceData}
              onViewStudent={(std) => setStudentToView(std)}
            />
          )}
        </main>
      </div>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isAddEditModalOpen}
        studentToEdit={studentToEdit}
        existingStudents={students}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setStudentToEdit(null);
        }}
        onSave={handleSaveStudent}
      />

      {/* Student Details / Profile View Modal */}
      <StudentDetailsModal
        student={studentToView}
        attendanceData={attendanceData}
        onClose={() => setStudentToView(null)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        student={studentToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setStudentToDelete(null)}
      />
    </div>
  );
}

