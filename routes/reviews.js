import express from "express";
import { ObjectId } from "mongodb";
import { connectDB } from "../db/connect.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

/** Helper: Recalculate average book rating */
async function recalculateBookRating(db, bookId) {
  const reviews = await db.collection("reviews").find({ bookId }).toArray();
  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      : 0;

  await db
    .collection("books")
    .updateOne({ _id: new ObjectId(bookId) }, { $set: { rating: avg } });
}

// READ all reviews for a book - PUBLIC
router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const { bookId } = req.query;
    const filter = bookId ? { bookId } : {};

    const reviews = await db
      .collection("reviews")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    res.json(reviews);
  } catch (err) {
    console.error("GET /reviews error:", err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

// CREATE a Review - PROTECTED
router.post("/", authenticateToken, async (req, res) => {
  try {
    const db = await connectDB();
    const { bookId, rating, content } = req.body;

    if (!bookId || !rating || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const review = {
      bookId,
      rating: Number(rating),
      content,
      userId: req.user.userId,
      username: req.user.username,
      createdAt: new Date(),
    };

    const result = await db.collection("reviews").insertOne(review);
    await recalculateBookRating(db, bookId);

    res.status(201).json({ _id: result.insertedId, ...review });
  } catch (err) {
    console.error("POST /reviews error:", err);
    res.status(500).json({ message: "Failed to create review" });
  }
});

// UPDATE a Review - PROTECTED
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const reviewId = new ObjectId(id);
    const existing = await db.collection("reviews").findOne({ _id: reviewId });

    if (!existing) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user owns this review
    if (existing.userId !== req.user.userId) {
      return res.status(403).json({ message: "You can only edit your reviews" });
    }

    const updateData = {
      ...(req.body.rating && { rating: Number(req.body.rating) }),
      ...(req.body.content && { content: req.body.content }),
    };

    await db.collection("reviews").updateOne(
      { _id: reviewId },
      { $set: updateData }
    );

    const updated = await db.collection("reviews").findOne({ _id: reviewId });
    await recalculateBookRating(db, existing.bookId);

    res.json(updated);
  } catch (err) {
    console.error("PUT /reviews/:id error:", err);
    res.status(500).json({ message: "Failed to update review" });
  }
});

// DELETE a Review - PROTECTED
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const review = await db.collection("reviews").findOne({ _id: new ObjectId(id) });
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user owns this review
    if (review.userId !== req.user.userId) {
      return res.status(403).json({ message: "You can only delete your own reviews" });
    }

    const result = await db.collection("reviews").deleteOne({ _id: new ObjectId(id) });

    if (!result.deletedCount) {
      return res.status(404).json({ message: "Review not found" });
    }

    await recalculateBookRating(db, review.bookId);

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /reviews/:id error:", err);
    res.status(500).json({ message: "Failed to delete review" });
  }
});

export default router;
