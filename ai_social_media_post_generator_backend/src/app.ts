import dotenv from "dotenv";
dotenv.config();
import express from "express";
import supabase from "./lib/config/supabaseClient.js";
import authRoute from "./api/authRoute.js";
import postRoute from "./api/postRoute.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || process.env.FRONTEND_URL_TWO,
  credentials: true,
}));

app.get("/", (req, res) => {
  res.send("🚀 AI Post Generator Backend is Live!");
});

// API Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/posts", postRoute);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
