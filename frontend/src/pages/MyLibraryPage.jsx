import React, { useEffect, useState } from "react";
import { fetchBooks } from "../api/booksAPI";
import { useAuth } from "../context/AuthContext";
import BookCard from "../components/BookCard";
import { useNavigate } from "react-router-dom";
import "../styles/MyLibrary.css";

export default function MyLibraryPage() {
  const [books, setBooks] = useState([]);
  const [activeShelf, setActiveShelf] = useState("all");
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const loadMyBooks = () => {
    fetchBooks()
      .then((data) => {
        const userIdStr =
          user?.userId?.toString?.() ||
          user?.userId ||
          user?.id?.toString?.() ||
          user?.id;

        const myBooks = data.filter((book) => {
          const bookUserId = book.userId?.toString?.() || book.userId;
          const isOwner = bookUserId === userIdStr;
          const isTracking =
            book.readingStatus === "reading" ||
            book.readingStatus === "completed";

          const matches = isOwner || isTracking;

          if (matches) {
            const source = isOwner ? "own" : "tracking";
            console.log(
              `✓ Found user book: ${book.title} (${source}, status: ${book.readingStatus})`,
            );
          }
          return matches;
        });

        console.log(
          `Loading books: Found ${myBooks.length} books for user ${userIdStr}`,
        );
        setBooks(myBooks);
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    loadMyBooks();
  }, [isAuthenticated, user, navigate]);

  // Auto-refresh every 2 seconds to catch any updates to reading status from other pages
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      loadMyBooks();
    }, 2000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  const getFilteredBooks = () => {
    if (activeShelf === "all") return books;
    return books.filter((book) => book.readingStatus === activeShelf);
  };

  const filteredBooks = getFilteredBooks();

  const shelves = [
    { id: "all", label: "📚 All Books", count: books.length },
    {
      id: "want-to-read",
      label: "📖 Want to Read",
      count: books.filter((b) => b.readingStatus === "want-to-read").length,
    },
    {
      id: "reading",
      label: "📕 Currently Reading",
      count: books.filter((b) => b.readingStatus === "reading").length,
    },
    {
      id: "completed",
      label: "✅ Completed",
      count: books.filter((b) => b.readingStatus === "completed").length,
    },
  ];

  return (
    <div className="my-library">
      <h2>My Library</h2>

      {/* Shelf Tabs */}
      <div className="shelf-tabs">
        {shelves.map((shelf) => (
          <button
            key={shelf.id}
            className={`shelf-tab ${activeShelf === shelf.id ? "active" : ""}`}
            onClick={() => setActiveShelf(shelf.id)}
          >
            {shelf.label}
            <span className="shelf-count">{shelf.count}</span>
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <div className="library-grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onBookDeleted={() => fetchBooks().then(setBooks)}
            />
          ))
        ) : (
          <div className="empty-shelf">
            <p className="empty-icon">📚</p>
            <p className="empty-text">No books in this shelf yet</p>
            <p className="empty-hint">
              {activeShelf === "all"
                ? "Add your first book to get started!"
                : `Mark a book as "${shelves.find((s) => s.id === activeShelf)?.label}" to see it here`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
