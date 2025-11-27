import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "../db/connect.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d"; // Token valid for 7 days

// Register new user
export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const db = await connectDB();

    // Check if user exists
    const existingUser = await db.collection("users").findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email 
          ? "Email already registered" 
          : "Username already taken" 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = {
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);

    // Generate token
    const token = jwt.sign(
      { userId: result.insertedId.toString(), username, email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: result.insertedId,
        username,
        email,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
}

// Login user
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const db = await connectDB();

    // Find user
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
}

// Get current user info
export async function getCurrentUser(req, res) {
  try {
    const db = await connectDB();
    const { ObjectId } = await import("mongodb");
    
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { password: 0 } } // Exclude password
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
