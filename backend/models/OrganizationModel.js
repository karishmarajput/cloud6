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
    default: false 
  },
  templates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template'
    }
  ]
});

// Create the Organisation model
const Organisation = mongoose.model('Organisation', organisationSchema);

module.exports = Organisation;
