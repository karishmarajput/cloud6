const express = require('express');
const router = express.Router();
const Admin = require('../models/admin'); // Import the Admin model
const Organisation = require('../models/organisation')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
router.use(bodyParser.json()); // Parse JSON bodies
router.use(bodyParser.urlencoded({ extended: true }));
// Route for admin registration
router.post('/register', async (req, res) => {
  try {
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

router.get('/unverified-organisations', async (req, res) => {
  try {
    // Fetch unverified organisations from your database
    const unverifiedOrganisations = await Organisation.find({ isVerified: false });

    res.json(unverifiedOrganisations); // Send the unverified organisations as JSON response
  } catch (error) {
    console.error('Error fetching unverified organisations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/verified-organisations', async (req, res) => {
  try {
    // Fetch unverified organisations from your database
    const unverifiedOrganisations = await Organisation.find({ isVerified: true });

    res.json(unverifiedOrganisations); // Send the unverified organisations as JSON response
  } catch (error) {
    console.error('Error fetching verified organisations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/verify-organisation/:id', async (req, res) => {
  const orgId = req.params.id;

  try {
    // Find the organisation by ID and update isVerified to true
    const organisation = await Organisation.findByIdAndUpdate(
      orgId,
      { $set: { isVerified: true } },
      { new: true }
    );

    if (!organisation) {
      return res.status(404).json({ message: 'Organisation not found' });
    }

    res.status(200).json({ message: 'Organisation verified successfully' });
  } catch (error) {
    console.error('Error verifying organisation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/delete-organisation/:id', async (req, res) => {
  const orgId = req.params.id;

  try {
    // Find the organisation by ID and update isVerified to true
    const organisation = await Organisation.findByIdAndDelete(
      orgId
    );

    if (!organisation) {
      return res.status(404).json({ message: 'Organisation not found' });
    }

    res.status(200).json({ message: 'Organisation deleted successfully' });
  } catch (error) {
    console.error('Error verifying organisation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
