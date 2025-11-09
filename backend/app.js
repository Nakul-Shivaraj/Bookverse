import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import indexRouter from "./routes/index.js";
import booksRouter from "./routes/books.js";
import reviewsRouter from "./routes/reviews.js";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/api/books", booksRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/", indexRouter);

export default app;
