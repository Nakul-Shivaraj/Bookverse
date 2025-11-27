const API_BASE = "/api/auth";

// Helper to get token from localStorage
export function getToken() {
  return localStorage.getItem("token");
}

// Helper to save token
export function saveToken(token) {
  localStorage.setItem("token", token);
}

// Helper to remove token
export function removeToken() {
  localStorage.removeItem("token");
}

// Register new user
export async function register(userData) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }

  // Save token on successful registration
  if (data.token) {
    saveToken(data.token);
  }

  return data;
}

// Login user
export async function login(credentials) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  // Save token on successful login
  if (data.token) {
    saveToken(data.token);
  }

  return data;
}

// Get current user
export async function getCurrentUser() {
  const token = getToken();

  if (!token) {
    throw new Error("No token found");
  }

  const res = await fetch(`${API_BASE}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    removeToken(); // Invalid token, remove it
    throw new Error("Failed to get user info");
  }

  return res.json();
}

// Logout
export function logout() {
  removeToken();
}

// Check if user is logged in
export function isAuthenticated() {
  return !!getToken();
}
