require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const mediaRoutes = require("./routes/media");
const uploadRoute = require("./routes/upload");

const app = express();

const cors = require("cors");

app.use(cors({
  origin: "https://gallery-omega-lovat.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

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