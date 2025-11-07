import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchBooks, deleteBook } from "../api/booksAPI";
import EditBookForm from "../components/EditBookForm";
import "../styles/BookDetailPage.css";
import "../styles/BookForm.css";

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
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks()
      .then((data) => {
        const found = data.find((b) => b._id === id);
        setBook(found || null);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!book) {
    return <p style={{ textAlign: "center", marginTop: 40 }}>Loading book details…</p>;
  }

  const placeholder = "https://placehold.co/200x300?text=No+Cover";

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${book.title}"?`)) return;

    const success = await deleteBook(book._id);
    if (success) {
      alert("🗑️ Book deleted successfully!");
      navigate("/"); // Go home after delete
    } else {
      alert("❌ Failed to delete book.");
    }
  };

  return (
    <div className="book-detail">
      {!isEditing ? (
        <>
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
            <div className="book-detail-buttons">
              <button className="edit-btn" onClick={() => setIsEditing(true)}>✏️ Edit</button>
              <button className="delete-btn" onClick={handleDelete}>🗑️ Delete</button>
              <Link to="/" className="back-link">← Back to Home</Link>
            </div>
          </div>
        </>
      ) : (
        <EditBookForm
          book={book}
          onBookUpdated={(updated) => {
            setBook(updated);
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
}

Rating.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
