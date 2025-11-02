const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { PDFDocument, rgb } = require("pdf-lib");

const UPLOAD_DIR = path.join(__dirname, "uploads");
const SIGNATURE_IMAGE_PATH = path.join(__dirname, "uploads", "signature.png");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage: storage }).single("myFile");

const app = express();
app.use(cors());
const port = 3000;

app.use("/files", express.static(UPLOAD_DIR));

app.post("/upload-and-sign", (req, res) => {
  upload(req, res, async (err) => {
    if (err || !req.file) {
      return res.status(400).json({
        message: "File upload failed or no file found.",
        error: err ? err.message : "No file",
      });
    }

    const originalFilePath = req.file.path;
    let signedFilePath = "";

    try {
      const existingPdfBytes = fs.readFileSync(originalFilePath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      const signatureImageBytes = fs.readFileSync(SIGNATURE_IMAGE_PATH);
      const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
      const signatureDims = signatureImage.scale(0.25);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      const { width, height } = firstPage.getSize();

      firstPage.drawImage(signatureImage, {
        x: width - signatureDims.width - 50,
        y: 50,
        width: signatureDims.width,
        height: signatureDims.height,
      });

      const pdfBytes = await pdfDoc.save();

      const signedFileName = `signed-img-${req.file.filename}`;
      signedFilePath = path.join(UPLOAD_DIR, signedFileName);
      fs.writeFileSync(signedFilePath, pdfBytes);

      fs.unlinkSync(originalFilePath);

      const fileUrl = `/files/${signedFileName}`;

      res.status(200).json({
        message: "PDF successfully signed with image and saved.",
        filePath: fileUrl,
      });
    } catch (error) {
      console.error("Image Signing Error:", error);
      if (fs.existsSync(originalFilePath)) {
        fs.unlinkSync(originalFilePath);
      }
      res
        .status(500)
        .json({ message: `Failed to sign PDF with image: ${error.message}` });
    }
  });
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
