const mongoose = require('mongoose');
const validator = require('validator');

const model = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  status: {
    type: String
  },
  createdAt: {
    type: Date
  }
});

module.exports = model;
