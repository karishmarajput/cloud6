const express = require('express');
const router = express.Router();
const Organisation = require('../models/organisation');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
router.use(bodyParser.json()); // Parse JSON bodies
router.use(bodyParser.urlencoded({ extended: true }));
// POST request to register a new organisation
router.post('/ogregister', async (req, res) => {
    console.log(req.body)
  try {
    const {
      ogNumber,
      name,
      phoneNumber,
      email,
      password
    } = req.body;

    // Check if the organization already exists with the provided ogNumber
    const existingOrg = await Organisation.findOne({ ogNumber });

    if (existingOrg) {
      return res.status(400).json({ message: 'Organization already exists with this OG number' });
    }

    // Create a new organisation
    const newOrganisation = new Organisation({
      ogNumber,
      name,
      phoneNumber,
      email,
      password
    });

    // Save the new organisation to the database
    await newOrganisation.save();

    res.status(201).json({ message: 'Organisation registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/oglogin', async (req, res) => {
    try {
      const { ogNumber, password } = req.body;
  
      // Check if the organisation with the provided ogNumber and password exists
      const organisation = await Organisation.findOne({ ogNumber, password });
  
      if (!organisation) {
        return res.status(401).json({ message: 'Invalid login credentials' });
      }
  
      // If credentials are valid, generate a JWT token
      const token = jwt.sign({ ogNumber }, 'your_secret_key'); // Change 'your_secret_key' to a secret key for signing tokens
  
      // Send the token in the response
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
module.exports = router;
