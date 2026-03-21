require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const mediaRoutes = require("./routes/media");
const uploadRoute = require("./routes/upload");

const app = express();

const cors = require("cors");

// ✅ VERY IMPORTANT: put CORS FIRST
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://gallery-omega-lovat.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ HANDLE PREFLIGHT REQUESTS
app.options("*", cors());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/upload", uploadRoute);

// Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected"))
  .catch(err => console.error(err));

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));