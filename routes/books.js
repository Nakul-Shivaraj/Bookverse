import express from "express";
import { connectDB } from "../db/connect.js";
import { ObjectId } from "mongodb";
import { authenticateToken, optionalAuth } from "../middleware/auth.js";

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

// CREATE a new book - PROTECTED
router.post("/", authenticateToken, async (req, res) => {
  try {
    const db = await connectDB();
    
    const newBook = {
      ...req.body,
      userId: req.user.userId,
      readingStatus: req.body.readingStatus || "want-to-read",
      progress: req.body.progress || { current: 0, total: 0 },
      startedDate: req.body.startedDate || null,
      completedDate: req.body.completedDate || null,
      createdAt: new Date(),
      updatedAt: new Date()
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

// UPDATE a book - PROTECTED
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // CRITICAL: Verify ownership
    const existingBook = await db.collection("books").findOne({ _id: new ObjectId(id) });
    if (!existingBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (existingBook.userId !== req.user.userId) {
      return res.status(403).json({ message: "You can only edit your own books" });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    // Auto-set dates based on status changes
    if (req.body.readingStatus === "reading" && !req.body.startedDate) {
      updateData.startedDate = new Date();
    }
    if (req.body.readingStatus === "completed" && !req.body.completedDate) {
      updateData.completedDate = new Date();
    }

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

// DELETE a book - PROTECTED
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // CRITICAL: Verify ownership before deleting
    const book = await db.collection("books").findOne({ _id: new ObjectId(id) });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.userId !== req.user.userId) {
      return res.status(403).json({ message: "You can only delete your own books" });
    }

    await db.collection("reviews").deleteMany({ bookId: id });
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

// UPDATE reading status and progress - PROTECTED
router.patch("/:id/progress", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const { readingStatus, progress } = req.body;
    const updateData = { updatedAt: new Date() };

    if (readingStatus) {
      updateData.readingStatus = readingStatus;
      
      // Auto-set dates
      if (readingStatus === "reading") {
        const book = await db.collection("books").findOne({ _id: new ObjectId(id) });
        if (!book.startedDate) {
          updateData.startedDate = new Date();
        }
      } else if (readingStatus === "completed") {
        updateData.completedDate = new Date();
      }
    }

    if (progress) {
      updateData.progress = progress;
    }

    const result = await db.collection("books").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    res.json(result.value || result);
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ message: "Failed to update progress" });
  }
});

export default router;
