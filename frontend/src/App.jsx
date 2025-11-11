import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookDetailPage from "./pages/BookDetailPage";
import Navbar from "./components/Navbar";
import Modal from "./components/Modal";
import BookForm from "./components/BookForm";

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleBookAdded = () => {
    setShowModal(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Router>
      <Navbar onAddBookClick={() => setShowModal(true)} />

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <BookForm onBookAdded={handleBookAdded} />
      </Modal>

      <Routes>
        <Route path="/" element={<HomePage key={refreshTrigger} />} />
        <Route path="/book/:id" element={<BookDetailPage />} />
      </Routes>
    </Router>
  );
}