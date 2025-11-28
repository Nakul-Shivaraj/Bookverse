import { getToken } from "./authAPI";

const API_BASE = "/api/books";

// Helper to get auth headers
function getAuthHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function fetchBooks() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

export async function addBook(newBook) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(newBook),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Failed to add book");
  }
  return data;
}

export async function deleteBook(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Failed to delete book");
    }
    return data;
  } catch (err) {
    console.error("Error deleting book:", err);
    return null;
  }
}

export async function updateBook(id, updatedData) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Response:", errText);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Update error:", err);
    return null;
  }
}

// Update reading status and progress (for all authenticated users, not just owners)
export async function updateBookProgress(id, progressData) {
  try {
    const res = await fetch(`${API_BASE}/${id}/progress`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(progressData),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Response:", errText);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Progress update error:", err);
    return null;
  }
}
