const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
require("dotenv").config();

const router = express.Router();

// ✅ Log environment variables (for debugging only, don't expose secrets in production!)
console.log("✅ ENV Check:", {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  API_KEY: process.env.CLOUDINARY_API_KEY,
  API_SECRET: process.env.CLOUDINARY_API_SECRET ? "✅ SET" : "❌ MISSING"
});

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Setup multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ POST /api/upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("📥 Incoming request to /api/upload");

    if (!req.file) {
      console.warn("⚠️ No file uploaded in the request");
      return res.status(400).json({ message: "No file Uploaded" });
    }

    console.log("📦 File details:");
    console.log("🖼️ Name:", req.file.originalname);
    console.log("📏 Size:", req.file.size, "bytes");
    console.log("🔍 Type:", req.file.mimetype);

    // Upload function using streamifier
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            //upload_preset: "rabbit_unsigned", // ✅ Use signed preset if needed
          },
          (error, result) => {
            if (result) {
              console.log("✅ Cloudinary Upload Success:", result.secure_url);
              resolve(result);
            } else {
              console.error("❌ Cloudinary Upload Error:", error);
              reject(error);
            }
          }
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    // Call upload
    const result = await streamUpload(req.file.buffer);

    // Send response
    res.json({ imageUrl: result.secure_url });

  } catch (error) {
    console.error("❌ Server Error in /api/upload:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
