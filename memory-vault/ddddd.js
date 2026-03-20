const mongoose = require("mongoose");

// ===== 1️⃣ Edit your Mongo URI here =====
const MONGO_URI = "mongodb://127.0.0.1:27017/past_memories";

// ===== 2️⃣ Define your Media schema =====
const mediaSchema = new mongoose.Schema({
  url: String,
  type: String
}, { collection: "media" }); // ensure this matches your collection name

const Media = mongoose.model("Media", mediaSchema);

// ===== 3️⃣ Connect to MongoDB =====
mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ===== 4️⃣ Delete all media =====
const deleteMedia = async () => {
  try {
    const result = await Media.deleteMany({});
    console.log(`Deleted ${result.deletedCount} media item(s) from MongoDB.`);
  } catch (err) {
    console.error("Error deleting media:", err);
  } finally {
    mongoose.disconnect();
  }
};

// ===== 5️⃣ Run the function =====
deleteMedia();