import { useState } from "react";
import PropTypes from "prop-types";
import { addBook } from "../api/booksAPI";
import "../styles/BookForm.css";

export default function BookForm({ onBookAdded }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isValidUrl = (url) => {
    if (!url) return true; // optional
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!title.trim() || !author.trim()) {
      setMessage("❌ Title and Author are required.");
      return;
    }
    if (rating && (+rating < 1 || +rating > 5)) {
      setMessage("❌ Rating must be between 1 and 5.");
      return;
    }
    if (!isValidUrl(coverImage)) {
      setMessage("❌ Cover Image must be a valid URL.");
      return;
    }

    const newBook = {
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim() || null,
      rating: rating ? Number(rating) : null,
      coverImage: coverImage.trim() || null,
      description: description.trim() || null,
      createdAt: new Date(),
    };

    try {
      setSubmitting(true);
      await addBook(newBook);
      setMessage("✅ Book added successfully!");
      setTitle("");
      setAuthor("");
      setGenre("");
      setRating("");
      setCoverImage("");
      setDescription("");
      onBookAdded && onBookAdded();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add book.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="book-form">
      <h2>Add a New Book</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title" className="sr-only">
          Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-required="true"
        />
        <label htmlFor="author" className="sr-only">
          Author
        </label>
        <input
          id="author"
          type="text"
          placeholder="Author *"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          aria-required="true"
        />
        <label htmlFor="genre" className="sr-only">
          Genre
        </label>
        <input
          id="genre"
          type="text"
          placeholder="Genre (e.g., Fiction, Sci-Fi)"
          value={genre}
          onChange={(e) => brush(e.target.value, setGenre)}
        />
        <label htmlFor="rating" className="sr-only">
          Rating
        </label>
        <input
          id="rating"
          type="number"
          placeholder="Rating (1–5)"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <label htmlFor="coverImage" className="sr-only">
          Cover Image URL
        </label>
        <input
          id="coverImage"
          type="url"
          placeholder="Cover Image URL (optional)"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
        />
        <label htmlFor="description" className="sr-only">
          Description
        </label>
        <textarea
          id="description"
          placeholder="Short description (optional)"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Adding…" : "➕ Add Book"}
        </button>
      </form>
      {message && (
        <p className="message" role="status">
          {message}
        </p>
      )}
    </div>
  );
}

// small helper to trim leading spaces while typing
function brush(val, setter) {
  setter(val.startsWith(" ") ? val.trimStart() : val);
}

BookForm.propTypes = {
  onBookAdded: PropTypes.func,
};
