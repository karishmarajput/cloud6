const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  templateId: {
    type: String,
    unique: true,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  public: {
    type: Boolean,
    default: true,
  },
});

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
