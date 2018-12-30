var mongoose = require('mongoose');

var EmailSchema = new mongoose.Schema({
  name: { type: String, required: true},
  subject: { type: String, required: true},
  body: { type: String, required: true},
  date: Date,
  event_id: { type: String, required: true},
  phase_id: { type: String, required: true},
  updated_at: { type: Date, default: Date.now },
    attachment: Array,
});

module.exports = mongoose.model('Email', EmailSchema);
