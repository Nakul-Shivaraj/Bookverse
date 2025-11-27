import express from "express";
import { connectDB } from "../db/connect.js";
import { ObjectId } from "mongodb";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET all books - PUBLIC (anyone can view)
router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const books = await db.collection("books").find().toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new book - PROTECTED (login required)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const db = await connectDB();
    const { title, author, description } = req.body;

    // Validation
    if (!title || !author) {
      return res.status(400).json({ message: "Title and author are required" });
    }

    const newBook = {
      title,
      author,
      description: description || "",
      userId: req.user.userId, // track owner
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("books").insertOne(newBook);

    res.status(201).json({
      _id: result.insertedId,
      ...newBook,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a book - PROTECTED (login required)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const existing = await db.collection("books").findOne({ _id: new ObjectId(id) });

    if (!existing) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Ensure user owns the book
    if (existing.userId !== req.user.userId) {
      return res.status(403).json({ message: "You can only edit your own books" });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };

    await db.collection("books").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    const updatedBook = await db.collection("books").findOne({ _id: new ObjectId(id) });
    res.json(updatedBook);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a book - PROTECTED (login required)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const book = await db.collection("books").findOne({ _id: new ObjectId(id) });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if user owns the book
    if (book.userId !== req.user.userId) {
      return res.status(403).json({ message: "You can only delete your own books" });
    }

    // Delete reviews for this book (bookId is stored as string)
    await db.collection("reviews").deleteMany({ bookId: id });

    await db.collection("books").deleteOne({ _id: new ObjectId(id) });

    res.json({ message: "Book and its reviews deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
