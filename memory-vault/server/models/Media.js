const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  url: String,
  type: String, // image or video
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Media", mediaSchema);