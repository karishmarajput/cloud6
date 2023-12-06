const express = require('express');
const multer = require('multer');
const app = express();
const cors = require('cors');
app.use(cors());
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  }
});

const upload = multer({ storage: storage });

app.post('/', upload.single('pdfFile'), (req, res) => {
  console.log('hello')
  if (req.file) {
    console.log('File uploaded:', req.file);
    res.status(200).json({ message: 'File uploaded successfully' });
  } else {
    res.status(400).json({ error: 'No file uploaded' });
  }
});
module.exports = app;