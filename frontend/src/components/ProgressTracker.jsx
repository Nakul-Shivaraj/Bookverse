import React, { useState } from "react";
import PropTypes from "prop-types";
import { useToast } from "./Toast";
import "../styles/ReadingStatus.css";

export default function ProgressTracker({
  progress,
  onProgressUpdate,
  disabled,
}) {
  const { addToast } = useToast();
  const [currentPage, setCurrentPage] = useState(
    String(progress?.current || 0),
  );
  const [totalPages, setTotalPages] = useState(String(progress?.total || 0));
  const [isEditing, setIsEditing] = useState(false);

  const currentNum = Number(currentPage) || 0;
  const totalNum = Number(totalPages) || 0;
  const percentage =
    totalNum > 0 ? Math.min((currentNum / totalNum) * 100, 100) : 0;

  const handleSave = () => {
    // Validate input values
    const current = Math.max(0, Number(currentPage) || 0);
    const total = Math.max(0, Number(totalPages) || 0);

    // Validation: total pages must be at least 1
    if (total === 0) {
      addToast("Total pages must be at least 1", "error");
      return;
    }

    // Validation: current cannot exceed total
    if (current > total) {
      addToast("Current page cannot exceed total pages", "error");
      return;
    }
    onProgressUpdate({ current, total });
    setIsEditing(false);
  };

  return (
    <div className="progress-tracker">
      <div className="progress-header">
        <label>Reading Progress:</label>
        {!disabled && (
          <button
            className="edit-progress-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "✏️ Update"}
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="progress-editor">
          <div className="progress-inputs">
            <input
              type="number"
              min="0"
              value={currentPage}
              onChange={(e) => setCurrentPage(e.target.value)}
              placeholder="Current page"
            />
            <span>/</span>
            <input
              type="number"
              min="0"
              value={totalPages}
              onChange={(e) => setTotalPages(e.target.value)}
              placeholder="Total pages"
            />
          </div>
          <button className="save-progress-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      ) : (
        <>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ "--progress-width": `${percentage}%` }}
            >
              <span className="progress-text">
                {percentage > 0 ? `${Math.round(percentage)}%` : ""}
              </span>
            </div>
          </div>
          <p className="progress-info">
            {currentNum} / {totalNum} pages
            {percentage === 100 && " 🎉"}
          </p>
        </>
      )}
    </div>
  );
}

ProgressTracker.propTypes = {
  progress: PropTypes.shape({
    current: PropTypes.number,
    total: PropTypes.number,
  }),
  onProgressUpdate: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
