# 🎓 Student Attendance Tracker (React + Vite)

A modern, responsive, and clean **Student Attendance Tracker** web application built with **React 18**, **Vite**, **JavaScript**, **HTML5**, and **CSS3**.

Designed specifically for teachers, administrators, and educational institutions to seamlessly manage classroom attendance, inspect individual consistency rates, and generate actionable reports.

---

## ✨ Features

### 📊 1. Modern & Attractive Dashboard
- **Key Metric Summary Cards**:
  - **Total Enrolled Students**
  - **Present Today** (with live dynamic counts)
  - **Absent Today** (with live counts)
  - **Overall Attendance Rate %**
- **Today's Attendance Visual Overview**:
  - Dual-colored progress bar depicting real-time Present vs. Absent ratio.
- **7-Day Attendance Trend Chart**:
  - Daily turnout % bar chart visualizing attendance patterns across recent sessions.
- **Class Breakdown**:
  - Class-wise attendance percentages (e.g. Class 10-A, Class 10-B) to compare sections.
- **Low Attendance Warning Alert Card**:
  - Automatically flags students whose cumulative attendance falls below **75%** so educators can take early intervention.
- **Recent Attendance History Log**:
  - Historical snapshot of the last 5 school sessions.

### 👥 2. Student Directory (Add, Edit, Delete, Search)
- **Search & Filter**:
  - Instant live search by student name or roll number.
  - Dropdown filter by class / section.
- **Student Profile Management**:
  - **Add Student**: Full Name, Roll Number, Class/Grade, Gender, Contact Email, Guardian Phone.
  - **Edit Student**: Instant updates to student info with roll number duplicate protection.
  - **Delete Student**: Safe deletion with confirmation prompt.
  - **Student Profile & Log Modal**: Inspect individual statistics (total days recorded, days present, days absent, attendance consistency) along with their complete date-by-date history.

### 📅 3. Daily Attendance Management
- **Date Selector**:
  - Pick any calendar date or use quick buttons: **Today**, **◀ Prev Day**, **Next Day ▶**.
- **Bulk Quick Actions**:
  - **Mark All Present** (1-click convenience for fast marking).
  - **Mark All Absent**
- **Single-Student Attendance Toggle**:
  - Clean green **Present** and red **Absent** toggle buttons.
  - Optional remarks/notes input (e.g., *Medical Leave*, *Family Function*, *Sports*).
- **Export & Print Daily Register**:
  - Download that specific day's roll call as CSV or trigger print formatting.
- **Live Date Stats Banner**:
  - Displays Total, Present, Absent, and Attendance Rate for the active date.
- **Automatic Auto-Save**:
  - Every mark or note is instantly saved to `localStorage`.

### 📈 4. Reports & Performance Analytics
- **Individual Student Attendance Percentages**:
  - Calculates cumulative percentages across all recorded sessions.
  - Progress bar with colored indicators:
    - 🟢 **Excellent** (≥ 85%)
    - 🔵 **Good** (75% - 84%)
    - 🟡 **Needs Attention / Warning** (< 75%)
- **Filter Reports**:
  - Filter by Name / Roll number.
  - Filter by Timeframe: **All Time**, **Last 7 Days**, **Last 30 Days**, **This Month**.
  - Filter by Class.
  - Filter by Status Category (*Excellent*, *Good*, *Needs Attention*).
- **Export & Print**:
  - **Export CSV**: Download a `.csv` file with comprehensive attendance records.
  - **Print / PDF**: Clean, print-optimized stylesheet for physical reports or saving as PDF.

### 💾 5. LocalStorage Persistence, Backup & Sample Data
- **Zero Backend Setup Required**:
  - All students and attendance history persist across browser reloads using browser `localStorage`.
- **JSON Backup & Restore**:
  - Export entire student and attendance database to `.json` file and restore it on any device.
- **Pre-populated Sample Records**:
  - Includes 10 realistic sample students across two classes (`Class 10-A` and `Class 10-B`) with 7 days of attendance history pre-loaded so you can explore all features right away.
- **Reset Demo Data**:
  - Easily restore sample data at any time with the "Reset Demo Data" button in the sidebar.

### 🌓 6. Dark & Light Theme Support
- Includes a smooth theme switcher in the header that automatically saves your preference.

---

## 🚀 How to Run the Application

### Option 1: Standard React + Vite (Recommended)
1. Install dependencies (already installed):
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser at `http://localhost:3000`.

To build for production:
```bash
npm run build
```

### Option 2: 1-Click Batch File (`start.bat`)
Double-click [**`start.bat`**](file:///c:/Student_attendence_tracker/start.bat) in the project folder. It automatically runs Vite or opens the app in your default browser.

### Option 3: Standalone Zero-Build Launch
Open [**`standalone.html`**](file:///c:/Student_attendence_tracker/standalone.html) directly in any web browser without needing `npm` or a local server.

---

## 📁 Project Structure

```
c:\Student_attendence_tracker\
├── package.json               # Project manifest with scripts, React 18, and Vite
├── vite.config.js             # Vite configuration with React plugin & port 3000
├── index.html                 # Main Vite application HTML entry point
├── styles.css                 # Comprehensive styling (Light & Dark themes, print styles)
├── start.bat                  # 1-click Windows runner
├── README.md                  # Complete documentation
├── standalone.html            # Standalone zero-dependency version
├── app.js                     # Root React script reference
└── src/                       # Modular React components & architecture
    ├── main.jsx               # React 18 DOM mount point
    ├── App.jsx                # Root application component
    ├── components/
    │   ├── Icons.jsx          # Embedded SVG icons set
    │   ├── Sidebar.jsx        # Navigation sidebar with backup/restore
    │   ├── Header.jsx         # Header with theme toggle & quick actions
    │   ├── Dashboard.jsx      # Metrics cards, 7-day trend chart & class stats
    │   ├── Students.jsx       # Student directory & management
    │   ├── Attendance.jsx     # Daily attendance sheet & register export
    │   ├── Reports.jsx        # Performance analytics & CSV export
    │   ├── StudentModal.jsx   # Add/Edit student dialog
    │   ├── StudentDetailsModal.jsx # Profile & log history modal
    │   ├── DeleteConfirmModal.jsx  # Deletion confirmation
    │   └── Toast.jsx          # Notification toasts
    ├── data/
    │   └── sampleData.js      # Sample dataset & attendance records generator
    └── utils/
        └── helpers.js         # Calculations & date helpers
```

---

## 🛠️ Technology Stack
- **React 18** (Functional components, Hooks: `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`)
- **Vite 6** (Blazing fast HMR and optimized production build)
- **JavaScript (ES6+)**
- **HTML5 & CSS3** (Custom properties, CSS Grid, Flexbox, media queries, print stylesheets)
- **Browser LocalStorage API**
