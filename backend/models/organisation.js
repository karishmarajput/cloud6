const mongoose = require('mongoose');

// Define the Organisation schema
const organisationSchema = new mongoose.Schema({
  ogNumber: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false // Set default value if not provided
  }
});

// Create the Organisation model
const Organisation = mongoose.model('Organisation', organisationSchema);

module.exports = Organisation;
