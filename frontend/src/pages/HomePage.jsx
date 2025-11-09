import React, { useEffect, useState } from "react";
import { fetchBooks } from "../api/booksAPI";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";
import "../styles/HomePage.css";

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("Latest");

  // 📄 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // 📊 Stats
  const [bookCount, setBookCount] = useState(0);
  const [avgRating, setAvgRating] = useState(0);

  const genres = ["All", "Fiction", "Sci-Fi", "Mystery", "History", "Fantasy", "Romance"];

  // 🔹 Fetch all books from backend
  const getBooks = async () => {
    try {
      const data = await fetchBooks();
      setBooks(data);
      setFilteredBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  useEffect(() => {
    let results = [...books];

    // 🔍 Search filter
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      results = results.filter(
        (b) =>
          b.title.toLowerCase().includes(lower) ||
          b.author.toLowerCase().includes(lower)
      );
    }

    // 🎭 Genre filter
    if (selectedGenre !== "All") {
      results = results.filter(
        (b) => (b.genre || "").toLowerCase() === selectedGenre.toLowerCase()
      );
    }

    // 🔃 Sorting
    switch (sortBy) {
      case "Rating":
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "Title":
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    // 📊 Stats update
    setBookCount(results.length);
    const totalRating = results.reduce((sum, b) => sum + (b.rating || 0), 0);
    setAvgRating(results.length ? (totalRating / results.length).toFixed(1) : 0);

    setFilteredBooks(results);
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [searchTerm, selectedGenre, sortBy, books]);

  // 📄 Pagination calculations
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentBooks = filteredBooks.slice(startIdx, startIdx + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="home-container">
      <h2>Explore Books</h2>

      {/* 📊 Stats Bar */}
      <div className="stats-bar">
        <p>
          <strong>{bookCount}</strong> {bookCount === 1 ? "Book" : "Books"} Found
        </p>
        <p>
          ⭐ <strong>{avgRating}</strong> Average Rating
        </p>
      </div>

      {/* 🔍 Filters */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="genre-buttons">
          {genres.map((g) => (
            <button
              key={g}
              className={`genre-btn ${selectedGenre === g ? "active" : ""}`}
              onClick={() => setSelectedGenre(g)}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="sort-container">
          <label htmlFor="sortSelect">Sort by:</label>
          <select
            id="sortSelect"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="Latest">Latest</option>
            <option value="Rating">Rating</option>
            <option value="Title">Title (A–Z)</option>
          </select>
        </div>
      </div>

      {/* 📚 Book Grid */}
      <div className="book-grid fade-grid">
        {currentBooks.length > 0 ? (
          currentBooks.map((book, i) => (
            <div
              key={book._id}
              className="fade-item"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <BookCard book={book} />
            </div>
          ))
        ) : (
          <p style={{ gridColumn: "1 / -1", color: "#555", marginTop: "40px" }}>
            No books found matching your filters.
          </p>
        )}
      </div>

      {/* 📄 Pagination */}
      {filteredBooks.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(val) => {
            setItemsPerPage(val);
            setCurrentPage(1);
          }}
          totalItems={filteredBooks.length}
        />
      )}
    </div>
  );
}