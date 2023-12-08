const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfUpload = require("../middlewares/upload_pdf");
const VerificationController = require("../controllers/VerificationController");
router.post("/uploadpdf",pdfUpload.single("pdf"),VerificationController.UploadPDF);
module.exports = router