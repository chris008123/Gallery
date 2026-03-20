const express = require("express");
const router = express.Router();
const Media = require("../models/Media");
const auth = require("../middleware/auth");

// ✅ GET all media (protected)
router.get("/", auth, async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ DELETE media
router.delete("/:id", auth, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({ error: "Media not found" });
    }

    await media.deleteOne();

    res.json({ message: "Media deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;