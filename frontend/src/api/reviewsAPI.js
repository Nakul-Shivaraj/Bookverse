import { getToken } from "./authAPI";

const API_BASE = "/api/reviews";

function getAuthHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function fetchReviews(bookId) {
  const res = await fetch(`${API_BASE}?bookId=${bookId}`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
}

// Add a new review
export async function addReview(review) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(review),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Failed to add review");
  }
  return data;
}

// Update a review
export async function updateReview(id, updatedData) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updatedData),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Failed to update review");
  }
  return data;
}

// Delete a review
export async function deleteReview(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete review");
  }
  return data;
}
