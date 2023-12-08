const mongoose = require('mongoose');

const organisationSchema = new mongoose.Schema({

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
    required: true,
    unique: true
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

const Organisation = mongoose.model('Organisation', organisationSchema);

module.exports = Organisation;
