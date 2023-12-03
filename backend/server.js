const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./DB/connection');

const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const router = express.Router();
router.use(bodyParser.json()); // Parse JSON bodies
router.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config();

connectDB();
const cors = require('cors');
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));
const ogRoutes = require('./routes/organisation');
const adminRoutes = require('./routes/admin')
app.use('/organisation', ogRoutes);
app.use('/admin', adminRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
