import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/Toast";
import HomePage from "./pages/HomePage";
import BookDetailPage from "./pages/BookDetailPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
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
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Navbar onAddBookClick={() => setShowModal(true)} />

          <Modal show={showModal} onClose={() => setShowModal(false)}>
            <BookForm onBookAdded={handleBookAdded} />
          </Modal>

          <Routes>
            <Route path="/" element={<HomePage key={refreshTrigger} />} />
            <Route path="/book/:id" element={<BookDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}
