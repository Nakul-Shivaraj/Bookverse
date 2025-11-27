import React from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { deleteBook } from "../api/booksAPI";
import { useAuth } from "../context/AuthContext";
import { useToast } from "./Toast";
import "../styles/BookCard.css";

function Rating({ value }) {
  const v = Number(value) || 0;
  const full = Math.floor(v);
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < full ? "★" : "☆",
  ).join("");
  return (
    <span className="rating">
      {stars} {v ? `(${v.toFixed(1)})` : ""}
    </span>
  );
}

export default function BookCard({ book, onBookDeleted }) {
  const placeholder = "https://placehold.co/200x300?text=No+Cover";
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!isAuthenticated) {
      addToast("Please login to delete books", "warning");
      navigate("/login");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${book.title}"?`))
      return;

    try {
      const success = await deleteBook(book._id);
      if (success) {
        addToast(`"${book.title}" deleted successfully`, "success");
        if (onBookDeleted) onBookDeleted(book._id);
      } else {
        addToast(
          "Failed to delete book. You may not have permission.",
          "error",
        );
      }
    } catch (err) {
      console.error("Error deleting:", err);
      addToast("Failed to delete book. Please try again.", "error");
    }
  };

  return (
    <div className="book-card">
      {book.rating >= 4.5 && <div className="badge">⭐ Top Rated</div>}
      <div className="book-cover">
        <img
          src={book.coverImage || placeholder}
          alt={book.title}
          loading="lazy"
        />
      </div>
      <div className="book-info">
        <h3>{book.title}</h3>
        <p className="author">by {book.author}</p>
        {book.genre && <span className="genre">{book.genre}</span>}
        <Rating value={book.rating} />
        <Link to={`/book/${book._id}`} className="details-link">
          View Details →
        </Link>
        <button className="delete-btn" onClick={handleDelete}>
          🗑️ Delete Book
        </button>
      </div>
    </div>
  );
}

BookCard.propTypes = {
  book: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    genre: PropTypes.string,
    rating: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    coverImage: PropTypes.string,
  }).isRequired,
  onBookDeleted: PropTypes.func,
};

Rating.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
