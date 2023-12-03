const express = require('express');
const router = express.Router();
const Admin = require('../models/admin'); // Import the Admin model
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
router.use(bodyParser.json()); // Parse JSON bodies
router.use(bodyParser.urlencoded({ extended: true }));
// Route for admin registration
router.post('/register', async (req, res) => {
  try {
    console.log('hi')
    const { username, password } = req.body;
    const existingAdmin = await Admin.findOne({ username });

    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists with this username' });
    }
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});
router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username });
  
      if (!admin || admin.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      const token = jwt.sign({ username: admin.username }, 'your_secret_key', {
        expiresIn: '1h' 
      });
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  });

module.exports = router;
