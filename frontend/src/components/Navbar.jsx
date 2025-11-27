import React from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar({ onAddBookClick }) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddBookClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    onAddBookClick();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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

        {isAuthenticated ? (
          <>
            <span className="user-greeting">Hi, {user?.username}!</span>
            <button className="add-btn" onClick={handleAddBookClick}>
              + Add Book
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-link">
              Login
            </Link>
            <Link to="/signup" className="signup-btn">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  onAddBookClick: PropTypes.func.isRequired,
};
