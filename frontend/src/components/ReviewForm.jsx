import React, { useState } from "react";
import PropTypes from "prop-types";
import { addReview } from "../api/reviewsAPI";
import "../styles/BookReviews.css";

export default function ReviewForm({ bookId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const newReview = await addReview({ bookId, rating, content });
      onReviewAdded(newReview);
      setRating(5);
      setContent("");
    } catch (err) {
      alert("❌ Failed to add review.");
      console.error(err);
    }
  };

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
        rows="3"
      />
      <button type="submit" className="btn-primary">
        + Add Review
      </button>
    </form>
  );
}

ReviewForm.propTypes = {
  bookId: PropTypes.string.isRequired,
  onReviewAdded: PropTypes.func.isRequired,
};
