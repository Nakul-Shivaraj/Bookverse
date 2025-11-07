import React from "react";
import PropTypes from "prop-types";
import "../styles/Navbar.css";

export default function Navbar({ onAddBookClick }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="logo">📚 BookVerse</h1>
      </div>
      <div className="navbar-right">
        <a href="/">Home</a>
        <button className="add-btn" onClick={onAddBookClick}>
          Add Book
        </button>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  onAddBookClick: PropTypes.func.isRequired,
};
