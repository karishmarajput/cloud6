const express = require('express');
const router = express.Router();
const Organisation = require('../models/organisation');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
router.use(bodyParser.json()); 
router.use(bodyParser.urlencoded({ extended: true }));

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

    const existingOrg = await Organisation.findOne({ ogNumber });

    if (existingOrg) {
      return res.status(400).json({ message: 'Organization already exists with this OG number' });
    }

    const newOrganisation = new Organisation({
      ogNumber,
      name,
      phoneNumber,
      email,
      password
    });
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
  
      const organisation = await Organisation.findOne({ ogNumber, password });
  
      if (!organisation) {
        return res.status(401).json({ message: 'Invalid login credentials' });
      }

      if(!organisation.isVerified){
        console.log('here')
        return res.status(401).json({ message: 'Your organisation is not verified yet, please wait for admin to verify it.' });
      }
      const token = jwt.sign({ ogNumber }, 'your_secret_key'); 

      res.status(200).json({ token });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
module.exports = router;
