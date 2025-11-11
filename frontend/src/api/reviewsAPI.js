const API_BASE = import.meta.env.PROD
  ? "https://bookverse-backend-p06v.onrender.com/api/reviews"
  : "/api/reviews";

// Fetch all reviews for a specific book
export async function fetchReviews(bookId) {
  const res = await fetch(`${API_BASE}?bookId=${bookId}`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
}

// Add a new review
export async function addReview(review) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });
  if (!res.ok) throw new Error("Failed to add review");
  return res.json();
}

// Update a review
export async function updateReview(id, updatedData) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) throw new Error("Failed to update review");
  return res.json();
}

// Delete a review
export async function deleteReview(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete review");
  return res.json();
}
