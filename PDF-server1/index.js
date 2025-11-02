const express = require("express");
const multer = require("multer");
const path = require("path"); // For working with file paths

const app = express();
const port = 3000;

// 1. Configure the storage
const storage = multer.diskStorage({
  // Specify the destination folder for the uploaded files
  destination: (req, file, cb) => {
    // Make sure this 'uploads' folder exists in your project root
    cb(null, "uploads/");
  },
  // Define the filename
  filename: (req, file, cb) => {
    // Create a unique filename (e.g., timestamp-originalfilename.ext)
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// 2. Initialize the upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Optional: limit file size to 1MB
  // Optional: Add a fileFilter function here for type validation
}).single("myFile");

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// ... (Previous setup code for express and upload) ...

// File Upload Endpoint for a single file
app.post("/upload-single", (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res
        .status(500)
        .json({ message: "An error occurred during the upload." });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "File uploaded successfully", file: req.file });
    }

    res
      .status(200)
      .json({ message: "File uploaded successfully", file: req.file });
  });
});
