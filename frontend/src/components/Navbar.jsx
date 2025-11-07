import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/" className="logo-text">📚 BookVerse</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/add">Add Book</Link> {/* optional future enhancement */}
      </div>
    </nav>
  );
}
