import React from 'react';
import { Icons } from './Icons.jsx';

export default function DeleteConfirmModal({ student, onConfirm, onCancel }) {
  if (!student) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ color: 'var(--danger)' }}>Confirm Deletion</h3>
          <button className="btn-modal-close" onClick={onCancel}><Icons.X /></button>
        </div>
        <div style={{ padding: '24px' }}>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '8px' }}>
            Are you sure you want to remove <strong>{student.name}</strong> (Roll #{student.rollNumber})?
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            This will permanently remove the student profile from your records.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-primary" style={{ backgroundColor: 'var(--danger)' }} onClick={onConfirm}>
            <Icons.Trash /> Delete Student
          </button>
        </div>
      </div>
    </div>
  );
}

