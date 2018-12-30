var mongoose = require('mongoose');

var PhaseSchema = new mongoose.Schema({
  name: String,
  tasks: Array,
  instructions: Array,
  start_date: Date,
  email: String,
  event_id: String,
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Phase', PhaseSchema);
