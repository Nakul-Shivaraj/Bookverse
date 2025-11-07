const API_BASE = "/api/books"; // Vite will proxy to backend

export async function fetchBooks() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

export async function addBook(newBook) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newBook),
  });
  if (!res.ok) throw new Error("Failed to add book");
  return res.json();
}

export async function deleteBook(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete book");
  return res.json();
}
