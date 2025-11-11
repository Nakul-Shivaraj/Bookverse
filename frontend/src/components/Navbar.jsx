import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar({ onAddBookClick }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="brand">
          📚 <span>BookVerse</span>
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <button className="add-btn" onClick={onAddBookClick}>
          + Add Book
        </button>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  onAddBookClick: PropTypes.func.isRequired,
};
