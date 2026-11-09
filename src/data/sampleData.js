// Sample student dataset and initial demonstration records
export const SAMPLE_STUDENTS = [
  { id: "std-001", rollNumber: "101", name: "Aarav Sharma", grade: "Class 10-A", gender: "Male", email: "aarav.sharma@example.com", phone: "+91 98765 43210" },
  { id: "std-002", rollNumber: "102", name: "Priya Patel", grade: "Class 10-A", gender: "Female", email: "priya.patel@example.com", phone: "+91 98765 43211" },
  { id: "std-003", rollNumber: "103", name: "Rohan Verma", grade: "Class 10-A", gender: "Male", email: "rohan.verma@example.com", phone: "+91 98765 43212" },
  { id: "std-004", rollNumber: "104", name: "Ananya Iyer", grade: "Class 10-A", gender: "Female", email: "ananya.iyer@example.com", phone: "+91 98765 43213" },
  { id: "std-005", rollNumber: "105", name: "Kabir Mehta", grade: "Class 10-A", gender: "Male", email: "kabir.mehta@example.com", phone: "+91 98765 43214" },
  { id: "std-006", rollNumber: "201", name: "Sneha Reddy", grade: "Class 10-B", gender: "Female", email: "sneha.reddy@example.com", phone: "+91 98765 43215" },
  { id: "std-007", rollNumber: "202", name: "Aditya Nair", grade: "Class 10-B", gender: "Male", email: "aditya.nair@example.com", phone: "+91 98765 43216" },
  { id: "std-008", rollNumber: "203", name: "Diya Chatterjee", grade: "Class 10-B", gender: "Female", email: "diya.c@example.com", phone: "+91 98765 43217" },
  { id: "std-009", rollNumber: "204", name: "Vikram Malhotra", grade: "Class 10-B", gender: "Male", email: "vikram.m@example.com", phone: "+91 98765 43218" },
  { id: "std-010", rollNumber: "205", name: "Meera Joshi", grade: "Class 10-B", gender: "Female", email: "meera.joshi@example.com", phone: "+91 98765 43219" }
];

export const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getOffsetDateString = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const generateSampleAttendance = () => {
  const d0 = getTodayDateString();
  const d1 = getOffsetDateString(1);
  const d2 = getOffsetDateString(2);
  const d3 = getOffsetDateString(3);
  const d4 = getOffsetDateString(4);
  const d5 = getOffsetDateString(5);
  const d6 = getOffsetDateString(6);

  return {
    [d0]: {
      "std-001": { status: "Present", remark: "" },
      "std-002": { status: "Present", remark: "" },
      "std-003": { status: "Absent", remark: "Viral Fever" },
      "std-004": { status: "Present", remark: "" },
      "std-005": { status: "Present", remark: "" },
      "std-006": { status: "Present", remark: "" },
      "std-007": { status: "Present", remark: "" },
      "std-008": { status: "Present", remark: "" },
      "std-009": { status: "Absent", remark: "Family Function" },
      "std-010": { status: "Present", remark: "" }
    },
    [d1]: {
      "std-001": { status: "Present", remark: "" },
      "std-002": { status: "Present", remark: "" },
      "std-003": { status: "Absent", remark: "Sick leave" },
      "std-004": { status: "Present", remark: "" },
      "std-005": { status: "Present", remark: "" },
      "std-006": { status: "Present", remark: "" },
      "std-007": { status: "Absent", remark: "Dentist visit" },
      "std-008": { status: "Present", remark: "" },
      "std-009": { status: "Present", remark: "" },
      "std-010": { status: "Present", remark: "" }
    },
    [d2]: {
      "std-001": { status: "Present", remark: "" },
      "std-002": { status: "Present", remark: "" },
      "std-003": { status: "Absent", remark: "" },
      "std-004": { status: "Present", remark: "" },
      "std-005": { status: "Present", remark: "" },
      "std-006": { status: "Present", remark: "" },
      "std-007": { status: "Present", remark: "" },
      "std-008": { status: "Present", remark: "" },
      "std-009": { status: "Absent", remark: "" },
      "std-010": { status: "Present", remark: "" }
    },
    [d3]: {
      "std-001": { status: "Present", remark: "" },
      "std-002": { status: "Present", remark: "" },
      "std-003": { status: "Present", remark: "" },
      "std-004": { status: "Present", remark: "" },
      "std-005": { status: "Absent", remark: "Sports competition" },
      "std-006": { status: "Present", remark: "" },
      "std-007": { status: "Present", remark: "" },
      "std-008": { status: "Present", remark: "" },
      "std-009": { status: "Absent", remark: "" },
      "std-010": { status: "Present", remark: "" }
    },
    [d4]: {
      "std-001": { status: "Present", remark: "" },
      "std-002": { status: "Absent", remark: "Personal" },
      "std-003": { status: "Present", remark: "" },
      "std-004": { status: "Present", remark: "" },
      "std-005": { status: "Present", remark: "" },
      "std-006": { status: "Present", remark: "" },
      "std-007": { status: "Absent", remark: "" },
      "std-008": { status: "Present", remark: "" },
      "std-009": { status: "Present", remark: "" },
      "std-010": { status: "Present", remark: "" }
    },
    [d5]: {
      "std-001": { status: "Present", remark: "" },
      "std-002": { status: "Present", remark: "" },
      "std-003": { status: "Present", remark: "" },
      "std-004": { status: "Present", remark: "" },
      "std-005": { status: "Present", remark: "" },
      "std-006": { status: "Present", remark: "" },
      "std-007": { status: "Present", remark: "" },
      "std-008": { status: "Absent", remark: "" },
      "std-009": { status: "Present", remark: "" },
      "std-010": { status: "Present", remark: "" }
    },
    [d6]: {
      "std-001": { status: "Present", remark: "" },
      "std-002": { status: "Present", remark: "" },
      "std-003": { status: "Present", remark: "" },
      "std-004": { status: "Present", remark: "" },
      "std-005": { status: "Present", remark: "" },
      "std-006": { status: "Present", remark: "" },
      "std-007": { status: "Present", remark: "" },
      "std-008": { status: "Present", remark: "" },
      "std-009": { status: "Present", remark: "" },
      "std-010": { status: "Present", remark: "" }
    }
  };
};

