// Utility functions for storage, date formatting and calculations

export const STORAGE_KEYS = {
  STUDENTS: "sat_students_v2",
  ATTENDANCE: "sat_attendance_v2"
};

export function formatFriendlyDate(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export function calculateStudentStats(studentId, attendanceData) {
  let presentDays = 0;
  let absentDays = 0;

  Object.keys(attendanceData).forEach((dateKey) => {
    const dayRecord = attendanceData[dateKey];
    if (dayRecord && dayRecord[studentId]) {
      const status = typeof dayRecord[studentId] === 'object' ? dayRecord[studentId].status : dayRecord[studentId];
      if (status === 'Present') presentDays++;
      else if (status === 'Absent') absentDays++;
    }
  });

  const totalRecorded = presentDays + absentDays;
  const percentage = totalRecorded > 0 ? ((presentDays / totalRecorded) * 100).toFixed(1) : "0.0";

  let statusCategory = "Excellent";
  let statusColor = "fill-excellent";
  const numPercent = parseFloat(percentage);

  if (totalRecorded === 0) {
    statusCategory = "No Records";
    statusColor = "fill-good";
  } else if (numPercent >= 85) {
    statusCategory = "Excellent";
    statusColor = "fill-excellent";
  } else if (numPercent >= 75) {
    statusCategory = "Good";
    statusColor = "fill-good";
  } else if (numPercent >= 65) {
    statusCategory = "Warning";
    statusColor = "fill-warning";
  } else {
    statusCategory = "Critical";
    statusColor = "fill-danger";
  }

  return {
    totalRecorded,
    presentDays,
    absentDays,
    percentage: parseFloat(percentage),
    statusCategory,
    statusColor
  };
}

