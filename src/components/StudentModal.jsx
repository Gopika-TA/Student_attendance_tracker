import React, { useState } from 'react';
import { Icons } from './Icons.jsx';

export default function StudentModal({ isOpen, onClose, onSave, studentToEdit, existingStudents }) {
  if (!isOpen) return null;

  const isEdit = Boolean(studentToEdit);
  const [name, setName] = useState(studentToEdit?.name || "");
  const [rollNumber, setRollNumber] = useState(studentToEdit?.rollNumber || "");
  const [grade, setGrade] = useState(studentToEdit?.grade || "Class 10-A");
  const [gender, setGender] = useState(studentToEdit?.gender || "Male");
  const [email, setEmail] = useState(studentToEdit?.email || "");
  const [phone, setPhone] = useState(studentToEdit?.phone || "");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter the student's full name.");
      return;
    }
    if (!rollNumber.trim()) {
      setError("Please enter a valid roll number.");
      return;
    }

    // Check roll number uniqueness
    const duplicate = existingStudents.find(
      (s) => s.rollNumber.trim().toLowerCase() === rollNumber.trim().toLowerCase() && s.id !== studentToEdit?.id
    );
    if (duplicate) {
      setError(`Roll number #${rollNumber} is already assigned to ${duplicate.name}.`);
      return;
    }

    const payload = {
      id: studentToEdit?.id || `std-${Date.now()}`,
      name: name.trim(),
      rollNumber: rollNumber.trim(),
      grade: grade.trim(),
      gender,
      email: email.trim(),
      phone: phone.trim()
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? "Edit Student Details" : "Add New Student"}</h3>
          <button className="btn-modal-close" onClick={onClose}>
            <Icons.X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="form-error-text" style={{ padding: '8px 12px', backgroundColor: '#fee2e2', borderRadius: '6px' }}>{error}</div>}

          <div className="form-row-two">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Roll Number *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 106"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row-two">
            <div className="form-group">
              <label className="form-label">Class / Section</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Class 10-A"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address (Optional)</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. rahul@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Guardian Phone Number (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. +91 98765 00000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="modal-footer" style={{ margin: '16px -24px -24px -24px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Icons.Check />
              <span>{isEdit ? "Save Changes" : "Create Student"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

