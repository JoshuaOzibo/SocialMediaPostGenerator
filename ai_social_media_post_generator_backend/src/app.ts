import dotenv from "dotenv";
dotenv.config();
import express from "express";
import supabase from "./lib/config/supabaseClient.js";
import route from "./api/authRoute.js";
const app = express();
const PORT = process.env.PORT || 8080;


app.use(express.json());

app.get("/", (req, res) => {
    console.log(supabase)
  res.send("🚀 AI Post Generator Backend is Live!");
});

app.use("/api/v1/auth", route);



app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
