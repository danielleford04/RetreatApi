var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
  name: { type: String, required: true},
  type: { type: String, required: true},
  start_date: { type: Date, required: true},
  end_date: Date,
  updated_at: { type: Date, default: Date.now },
  retreatant_count: { type: Number, required: true},
    user_id: { type: String, required: true}
});

module.exports = mongoose.model('Event', EventSchema);
