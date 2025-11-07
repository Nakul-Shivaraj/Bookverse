import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateBook } from "../api/booksAPI";
import "../styles/BookForm.css";

export default function EditBookForm({ book, onBookUpdated }) {
  const [formData, setFormData] = useState({
    title: book.title || "",
    author: book.author || "",
    genre: book.genre || "",
    rating: book.rating || "",
    coverImage: book.coverImage || "",
    description: book.description || "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // handle form input changes
  const handleChange = (e) => {
    const value = e.target.name === 'rating' && e.target.value 
      ? Number(e.target.value) 
      : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // handle submit (PUT request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateBook(book._id, formData);
      if (updated) {
        setMessage("✅ Book updated successfully!");
        onBookUpdated(updated);
        // redirect after short delay
        setTimeout(() => navigate("/"), 1000);
      } else {
        setMessage("❌ Failed to update book.");
      }
    } catch (error) {
      console.error("Error updating book:", error);
      setMessage("❌ An error occurred while updating.");
    }
  };

  return (
    <div className="book-form">
      <h2>Edit Book</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title *"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          name="author"
          placeholder="Author *"
          value={formData.author}
          onChange={handleChange}
          required
        />
        <input
          name="genre"
          placeholder="Genre (e.g., Fiction, Sci-Fi)"
          value={formData.genre}
          onChange={handleChange}
        />
        <input
          name="rating"
          type="number"
          min="1"
          max="5"
          placeholder="Rating (1–5)"
          value={formData.rating}
          onChange={handleChange}
        />
        <input
          name="coverImage"
          placeholder="Cover Image URL (optional)"
          value={formData.coverImage}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Short description (optional)"
          value={formData.description}
          onChange={handleChange}
        />
        <button type="submit">💾 Save Changes</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
