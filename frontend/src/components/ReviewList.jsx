import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import {
  fetchReviews,
  deleteReview,
  updateReview,
} from "../api/reviewsAPI";
import "../styles/BookReviews.css";

function StarRating({ value }) {
  const full = Math.floor(value);
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < full ? "star selected" : "star"}>
      ★
    </span>
  ));
  return <div className="review-stars">{stars}</div>;
}

StarRating.propTypes = {
  value: PropTypes.number.isRequired,
};

export default function ReviewList({ bookId }) {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [editedRating, setEditedRating] = useState(0);

  // --- Load reviews ---
  const load = useCallback(async () => {
    try {
      const data = await fetchReviews(bookId);
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  }, [bookId]);

  useEffect(() => {
    load();
  }, [load]);

  // --- Handle Delete ---
  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert("❌ Failed to delete review.");
      console.error(err);
    }
  }

  // --- Handle Edit Save ---
  async function handleSave(id) {
    if (!editedText.trim()) return;
    try {
      const updated = await updateReview(id, {
        content: editedText,
        rating: editedRating,
      });
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? updated : r))
      );
      setEditingId(null);
    } catch (err) {
      alert("❌ Failed to update review.");
      console.error(err);
    }
  }

  // --- Handle Edit Click ---
  function handleEdit(review) {
    setEditingId(review._id);
    setEditedText(review.content);
    setEditedRating(review.rating);
  }

  if (reviews.length === 0) {
    return (
      <p style={{ textAlign: "center", marginTop: 10, color: "#555" }}>
        No reviews yet. Be the first to share your thoughts!
      </p>
    );
  }

  return (
    <div className="reviews-container">
      {reviews.map((r) => (
        <div key={r._id} className="review-card">
          {editingId === r._id ? (
            <>
              <div className="edit-stars">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    className={n <= editedRating ? "star selected" : "star"}
                    onClick={() => setEditedRating(n)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows="3"
              />
              <div className="review-actions">
                <button
                  className="btn-primary"
                  onClick={() => handleSave(r._id)}
                >
                  💾 Save
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setEditingId(null)}
                >
                  ✖ Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <StarRating value={r.rating} />
              <p className="review-content">{r.content}</p>
              <p className="review-date">
                {new Date(r.createdAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
              <div className="review-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(r)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(r._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

ReviewList.propTypes = {
  bookId: PropTypes.string.isRequired,
};
