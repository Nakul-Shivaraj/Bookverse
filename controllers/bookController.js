import { connectDB } from "../db/connect.js";
import { ObjectId } from "mongodb";

// Get all books
export async function getAllBooks(req, res) {
  try {
    const db = await connectDB();
    const books = await db.collection("books").find().limit(50).toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get one book
export async function getBookById(req, res) {
  try {
    const db = await connectDB();
    const book = await db.collection("books").findOne({
      _id: new ObjectId(req.params.id)
    });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Add a book
export async function addBook(req, res) {
  try {
    const db = await connectDB();
    const newBook = req.body;
    const result = await db.collection("books").insertOne(newBook);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update a book
export async function updateBook(req, res) {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const updated = await db.collection("books").updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete a book
export async function deleteBook(req, res) {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const result = await db.collection("books").deleteOne({
      _id: new ObjectId(id)
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
