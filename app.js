import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import indexRouter from "./routes/index.js";
import booksRouter from "./routes/books.js";
import reviewsRouter from "./routes/reviews.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "frontend/dist")));


// Routes
app.use("/api/books", booksRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/", indexRouter);

export default app;
