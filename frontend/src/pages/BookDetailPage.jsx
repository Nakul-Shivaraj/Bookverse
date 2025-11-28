import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchBooks, deleteBook, updateBook, updateBookProgress } from "../api/booksAPI";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import EditBookForm from "../components/EditBookForm";
import BookReviews from "../components/BookReviews";
import ReadingStatusSelector from "../components/ReadingStatusSelector";
import ProgressTracker from "../components/ProgressTracker";
import "../styles/BookDetailPage.css";
import "../styles/BookForm.css";
import "../styles/BookReviews.css";

function Rating({ value }) {
  const v = Number(value) || 0;
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < Math.round(v) ? "star selected" : "star"}>
      ★
    </span>
  ));
  return (
    <span className="rating-display">
      {stars}
      <span className="rating-number">{v ? `(${v.toFixed(1)})` : ""}</span>
    </span>
  );
}

Rating.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const loadBook = useCallback(() => {
    fetchBooks()
      .then((data) => {
        const found = data.find((b) => b._id === id);
        setBook(found || null);
      })
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    loadBook();
  }, [loadBook]);

  if (!book) return <p className="loading-text">Loading...</p>;

  const placeholder = "https://placehold.co/200x300?text=No+Cover";
  const isOwner = user && book.userId === user.userId;

  const handleDelete = async () => {
    if (!isAuthenticated) {
      addToast("Please login to delete books", "warning");
      navigate("/login");
      return;
    }

    if (!isOwner) {
      addToast("You can only delete your own books", "warning");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${book.title}"?`))
      return;

    try {
      const success = await deleteBook(book._id);
      if (success) {
        addToast("Book deleted successfully!", "success");
        navigate("/");
      } else {
        addToast(
          "Failed to delete book. You may not have permission.",
          "error",
        );
      }
    } catch (err) {
      addToast("Failed to delete book", "error");
      console.log(err);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!isAuthenticated) {
      addToast("Please login to update reading status", "warning");
      navigate("/login");
      return;
    }

    try {
      const updated = await updateBookProgress(book._id, {
        readingStatus: newStatus,
      });
      if (updated) {
        setBook(updated);
        addToast("Reading status updated!", "success");
      }
    } catch (err) {
      addToast("Failed to update status", "error");
      console.log(err);
    }
  };

  const handleProgressUpdate = async (progress) => {
    if (!isAuthenticated) return;

    try {
      const updated = await updateBookProgress(book._id, { progress });
      if (updated) {
        setBook(updated);
        addToast("Progress updated!", "success");
      }
    } catch (err) {
      addToast("Failed to update progress", "error");
      console.log(err);
    }
  };

  const handleEdit = () => {
    if (!isAuthenticated) {
      addToast("Please login to edit books", "warning");
      navigate("/login");
      return;
    }
    setIsEditing(true);
  };

  return (
    <div className="book-detail">
      {!isEditing ? (
        <>
          <div className="book-detail-header">
            <img
              src={book.coverImage || placeholder}
              alt={book.title}
              className="book-detail-img"
            />

            <div className="book-detail-info">
              <h2 className="book-detail-title">{book.title}</h2>
              <p>
                <strong>Author:</strong> {book.author}
              </p>
              {book.genre && (
                <p>
                  <strong>Genre:</strong> {book.genre}
                </p>
              )}
              <p>
                <strong>Rating:</strong> <Rating value={book.rating} />
              </p>
              {book.description && (
                <p>
                  <strong>Description:</strong> {book.description}
                </p>
              )}

              {/* Reading Status Selector - Available to all authenticated users */}
              {isAuthenticated && (
                <>
                  <ReadingStatusSelector
                    currentStatus={book.readingStatus || "want-to-read"}
                    onStatusChange={handleStatusChange}
                  />

                  {/* Show progress tracker only when "reading" */}
                  {book.readingStatus === "reading" && (
                    <ProgressTracker
                      progress={book.progress || { current: 0, total: 0 }}
                      onProgressUpdate={handleProgressUpdate}
                    />
                  )}
                </>
              )}

              <div className="book-detail-buttons">
                {isAuthenticated && (
                  <>
                    <button className="edit-btn" onClick={handleEdit}>
                      ✏️ Edit
                    </button>
                    <button className="delete-btn" onClick={handleDelete}>
                      🗑️ Delete
                    </button>
                  </>
                )}
                <Link to="/" className="back-link">
                  ← Back
                </Link>
              </div>
            </div>
          </div>

          <BookReviews bookId={book._id} onReviewsUpdated={loadBook} />
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
