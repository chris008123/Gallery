require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const mediaRoutes = require("./routes/media");
const uploadRoute = require("./routes/upload");

const app = express();

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://gallery-omega-lovat.vercel.app"
];

// ✅ CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman or mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

// ✅ Apply CORS
app.use(cors(corsOptions));

// ✅ Handle preflight requests (VERY IMPORTANT)
app.options("*", cors(corsOptions));

// ✅ Debug logger (helps trace issues)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ✅ Parse JSON
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/upload", uploadRoute);

// ✅ Health check route (important for Render)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Database connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Start server (Render fix: bind 0.0.0.0)
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});