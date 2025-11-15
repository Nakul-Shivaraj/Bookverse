const API_BASE = "/api/books";

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

// DELETE a book by ID
export async function deleteBook(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete book");
    return await res.json();
  } catch (err) {
    console.error("Error deleting book:", err);
    return null;
  }
}

export async function updateBook(id, updatedData) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    console.log("PUT request URL:", `/api/books/${id}`);

    if (!res.ok) {
      console.error("❌ Update failed. Status:", res.status);
      const errText = await res.text();
      console.error("Response:", errText);
      return null;
    }

    const data = await res.json();
    console.log("✅ Updated data:", data);
    return data;
  } catch (err) {
    console.error("Update error:", err);
    return null;
  }
}
