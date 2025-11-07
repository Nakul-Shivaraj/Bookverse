import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams, Link } from "react-router-dom";
import { fetchBooks } from "../api/booksAPI";
import "../styles/BookDetailPage.css";

function Rating({ value }) {
  const v = Number(value) || 0;
  const full = Math.floor(v);
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < full ? "★" : "☆"
  ).join("");
  return <span className="rating">{stars} {v ? `(${v})` : ""}</span>;
}

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    fetchBooks()
      .then((data) => {
        const found = data.find((b) => b._id === id);
        setBook(found || null);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!book) return <p style={{ textAlign: "center", marginTop: 40 }}>Loading book details…</p>;

  const placeholder = "https://placehold.co/200x300?text=No+Cover";

  return (
    <div className="book-detail">
      <img
        src={book.coverImage || placeholder}
        alt={book.title}
        className="book-detail-img"
      />
      <div className="book-detail-info">
        <h2>{book.title}</h2>
        <p><strong>Author:</strong> {book.author}</p>
        {book.genre && <p><strong>Genre:</strong> {book.genre}</p>}
        <p><strong>Rating:</strong> <Rating value={book.rating} /></p>
        {book.description && (
          <p><strong>Description:</strong> {book.description}</p>
        )}
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    </div>
  );
}

Rating.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
