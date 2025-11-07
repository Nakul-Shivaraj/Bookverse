import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "../styles/BookCard.css";

function Rating({ value }) {
  const v = Number(value) || 0;
  const full = Math.floor(v);
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < full ? "★" : "☆"
  ).join("");
  return <span className="rating">{stars} {v ? `(${v})` : ""}</span>;
}

export default function BookCard({ book }) {
  const placeholder = "https://placehold.co/200x300?text=No+Cover";
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
        <p className="author">{book.author}</p>
        {book.genre && <p className="genre">{book.genre}</p>}
        <Rating value={book.rating} />
        <Link to={`/book/${book._id}`} className="details-link">
          View Details →
        </Link>
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
};

Rating.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
