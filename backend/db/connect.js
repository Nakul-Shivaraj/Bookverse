import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
let db;

export async function connectDB() {
  if (!db) {
    if (!uri) {
      throw new Error("❌ MONGO_URI is missing in .env file");
    }
    await client.connect();
    db = client.db(process.env.DB_NAME || "bookverseDB");
    console.log("✅ MongoDB connected");
  }
  return db;
}
