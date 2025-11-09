import express from "express";
import { connectDB } from "../db/connect.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// CREATE a new book
router.post("/", async (req, res) => {
  try {
    const db = await connectDB();
    
    // Add timestamps
    const newBook = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("books").insertOne(newBook);
    
    // Return the created book with its ID
    res.status(201).json({
      _id: result.insertedId,
      ...newBook
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all books
router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const books = await db.collection("books").find().toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a book (PUT)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Add updatedAt timestamp
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    const result = await db.collection("books").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    const updatedBook = result.value || result;

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Failed to update book" });
  }
});

// DELETE a book
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Also delete all reviews for this book
    await db.collection("reviews").deleteMany({ bookId: id });

    // Delete the book
    const result = await db.collection("books").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "✅ Book and its reviews deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "❌ Failed to delete book" });
  }
});

export default router;
