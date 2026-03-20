const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Media = require("../models/Media");
const auth = require("../middleware/auth");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", auth, upload.single("file"), async (req, res) => {
  try {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      async (error, result) => {
        if (error) return res.status(500).json({ error: "Upload failed" });

        const newMedia = new Media({
          url: result.secure_url,
          type: result.resource_type,
        });

        await newMedia.save();
        res.json(newMedia);
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;