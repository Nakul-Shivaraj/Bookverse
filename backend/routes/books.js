import express from "express";
import { connectDB } from "../db/connect.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("books").insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

    const result = await db.collection("books").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: req.body },
      { returnDocument: "after", returnOriginal: false } // ✅ ensures updated doc is returned
    );

    // Note: depending on driver version, only one of these works.
    const updatedBook = result.value || result;

    if (!updatedBook) {
      console.warn("⚠️ Book updated but no value returned");
      return res.json({ message: "Book updated successfully (no doc returned)" });
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

    const result = await db.collection("books").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "✅ Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "❌ Failed to delete book" });
  }
});

export default router;
