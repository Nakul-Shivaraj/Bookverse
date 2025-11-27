import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "./Toast";
import {
  fetchReviews,
  addReview,
  updateReview,
  deleteReview,
} from "../api/reviewsAPI";
import "../styles/BookReviews.css";

export default function BookReviews({ bookId, onReviewsUpdated }) {
  const [reviews, setReviews] = useState([]);
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!bookId) return;
    fetchReviews(bookId)
      .then((data) => setReviews(data))
      .catch((err) => console.error("Error fetching reviews:", err));
  }, [bookId]);

  const handleAddReview = async (rating, content) => {
    if (!isAuthenticated) {
      addToast("Please login to write a review", "warning");
      navigate("/login");
      return;
    }

    try {
      const newReview = await addReview({ bookId, rating, content });
      setReviews((prev) => [newReview, ...prev]);
      onReviewsUpdated?.();
      addToast("Review added successfully!", "success");
    } catch (err) {
      addToast(err.message || "Failed to add review", "error");
    }
  };

  const handleUpdateReview = async (reviewId, rating, content) => {
    try {
      const updated = await updateReview(reviewId, { rating, content });
      setReviews((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r)),
      );
      onReviewsUpdated?.();
      addToast("Review updated successfully!", "success");
    } catch (err) {
      addToast(
        err.message ||
          "Failed to update review. You can only edit your own reviews.",
        "error",
      );
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      onReviewsUpdated?.();
      addToast("Review deleted successfully!", "success");
    } catch (err) {
      addToast(
        err.message ||
          "Failed to delete review. You can only delete your own reviews.",
        "error",
      );
    }
  };

  return (
    <div className="reviews-wrapper">
      <h3 className="reviews-title">Community Reviews</h3>
      <ReviewForm onAdd={handleAddReview} />
      <ReviewList
        reviews={reviews}
        onUpdate={handleUpdateReview}
        onDelete={handleDeleteReview}
      />
    </div>
  );
}

BookReviews.propTypes = {
  bookId: PropTypes.string.isRequired,
  onReviewsUpdated: PropTypes.func,
};

/* Subcomponents */

function ReviewForm({ onAdd }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    await onAdd(rating, content);
    setRating(5);
    setContent("");
    setLoading(false);
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="star-input">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={n <= rating ? "star selected" : "star"}
            onClick={() => setRating(n)}
          >
            ★
          </span>
        ))}
      </div>

      <textarea
        placeholder="Write your review..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        required
      />
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Adding..." : "+ Add Review"}
      </button>
    </form>
  );
}

ReviewForm.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

function ReviewList({ reviews, onUpdate, onDelete }) {
  if (!reviews.length) {
    return <p className="no-reviews">No reviews yet. Be the first!</p>;
  }

  return (
    <div className="review-list">
      {reviews.map((rev) => (
        <ReviewItem
          key={rev._id}
          review={rev}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

ReviewList.propTypes = {
  reviews: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

function ReviewItem({ review, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(review.content);
  const [rating, setRating] = useState(review.rating);
  const { user } = useAuth(); // ✅ Import useAuth at top of file

  // Check if current user owns this review
  const isOwner = user && review.userId === user.id?.toString();

  async function handleSave() {
    if (!content.trim()) return;
    await onUpdate(review._id, rating, content);
    setIsEditing(false);
  }

  return (
    <div className="review-card">
      {!isEditing ? (
        <>
          <div className="review-stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className={n <= review.rating ? "star selected" : "star"}
              >
                ★
              </span>
            ))}
          </div>
          <p className="review-content">{review.content}</p>
          <small className="review-author">
            by {review.username || "Anonymous"}
          </small>
          <small className="review-date">
            {new Date(review.createdAt).toLocaleString()}
          </small>

          {isOwner && (
            <div className="review-actions">
              <button className="btn-edit" onClick={() => setIsEditing(true)}>
                ✏️ Edit
              </button>
              <button
                className="btn-delete"
                onClick={() => onDelete(review._id)}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="star-input">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className={n <= rating ? "star selected" : "star"}
                onClick={() => setRating(n)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
          <div className="review-actions">
            <button className="btn-primary" onClick={handleSave}>
              💾 Save
            </button>
            <button
              className="btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              ✖ Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}

ReviewItem.propTypes = {
  review: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
