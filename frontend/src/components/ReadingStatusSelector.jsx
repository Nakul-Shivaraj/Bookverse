import React from "react";
import PropTypes from "prop-types";
import "../styles/ReadingStatus.css";

export default function ReadingStatusSelector({
  currentStatus,
  onStatusChange,
  disabled,
}) {
  const statuses = [
    { value: "want-to-read", label: "📚 Want to Read" },
    { value: "reading", label: "📕 Reading" },
    { value: "completed", label: "✅ Completed" },
  ];

  return (
    <div className="reading-status-selector">
      <label>Reading Status:</label>
      <div className="status-buttons">
        {statuses.map((status) => (
          <button
            key={status.value}
            className={`status-btn ${status.value} ${
              currentStatus === status.value ? "active" : ""
            }`}
            onClick={() => onStatusChange(status.value)}
            disabled={disabled}
          >
            {status.label}
          </button>
        ))}
      </div>
    </div>
  );
}

ReadingStatusSelector.propTypes = {
  currentStatus: PropTypes.string,
  onStatusChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
