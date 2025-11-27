import React, { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import {
  getCurrentUser,
  logout as logoutAPI,
  isAuthenticated,
} from "../api/authAPI";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    async function checkAuth() {
      if (isAuthenticated()) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error("Auth check failed:", err);
          setUser(null);
        }
      }
      setLoading(false);
    }

    checkAuth();
  }, []);

  const login = (userData) => {
    // Normalize user data to ensure consistent ID field
    const normalizedUser = {
      ...userData,
      id: userData.id || userData._id,
    };
    setUser(normalizedUser);
  };

  const logout = () => {
    logoutAPI();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
