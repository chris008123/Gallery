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

// ✅ CORS config
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / mobile

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

// ✅ Apply CORS
app.use(cors(corsOptions));

// ✅ Handle preflight (NO wildcard crash)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(200);
  }
  next();
});

// ✅ Debug logger (helps track requests)
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

// ✅ Health check (Render needs this)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Database connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// ✅ Start server (IMPORTANT for Render)
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});