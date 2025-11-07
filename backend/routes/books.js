import express from "express";
import { connectDB } from "../db/connect.js";

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

export default router;
