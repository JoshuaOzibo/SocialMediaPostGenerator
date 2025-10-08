import dotenv from "dotenv";
import { Request, Response } from "express";
dotenv.config();
import express from "express";
// import supabase from "./lib/config/supabaseClient.js";
import authRoute from "./api/authRoute.js";
import postRoute from "./api/postRoute.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin || "*");
  },
  credentials: true,
}));


// app.use(cors({
//   origin: process.env.FRONTEND_URL || process.env.FRONTEND_URL_TWO || "*",
//   credentials: true,
// }));

// Configure body parsing with larger limits for image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("🚀 AI Post Generator Backend is Live!");
});

// API Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/posts", postRoute);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
