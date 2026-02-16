/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application} from "express";
import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import AppError from "./app/errorHelpers/AppError";
import status from "http-status";
import cookieParser from "cookie-parser";

const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser())

app.use("/api/v1", IndexRoutes);

// Basic route
app.get("/", async () => {
  throw new AppError(status.BAD_REQUEST, "This is a custom error message");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
