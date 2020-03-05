const mongoose = require('mongoose');

const ScoldingSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  scold: {
    type: String,
    required: true
  },
  scolded_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('scoldings', ScoldingSchema);
