import React from "react";
import "../styles/Modal.css";

export default function Modal({ show, onClose, children }) {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
