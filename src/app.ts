/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response } from "express";
import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path";
import cors from "cors";
import { envVars } from "./config/env";
import qs from "qs";
import { PaymentController } from "./app/module/payment/payment.controller";
import cron from "node-cron"
import { AppointmentService } from "./app/module/appointment/appointment.service";

const app: Application = express();
app.set("query parser", (str: string) => {
  return qs.parse(str);
});

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/templates`));

app.post("/webhook",express.raw({type: 'application/json'}),PaymentController.handleStripeHookEvent);

app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL,
      envVars.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/auth", toNodeHandler(auth));
 
// enable parsing of urlencoded bodies
app.use(express.urlencoded({ extended: true }));


// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


cron.schedule("*/25 * * * *", async() => {
  try {
    console.log("Running cron job to cancel unpaid appointments...");
    await AppointmentService.cancelUnpaidAppointments();
  } catch (error:any) {
    console.log(`Error running cron job to cancel unpaid appointments`,error.message);
  }
})

app.use("/api/v1", IndexRoutes);

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});
app.use(globalErrorHandler);
app.use(notFound);

export default app;
