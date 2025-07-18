import dotenv from "dotenv";
dotenv.config();
import express from "express";
import supabase from "./lib/config/supabaseClient.js";
import authRoute from "./api/authRoute.js";
import postRoute from "./api/postRoute.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 AI Post Generator Backend is Live!");
});

// API Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/posts", postRoute);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
