import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import booksRouter from "./routes/books.js";

const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api/books", booksRouter);

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);

export default app;
