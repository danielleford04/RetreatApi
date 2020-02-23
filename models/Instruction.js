var mongoose = require('mongoose');

var InstructionSchema = new mongoose.Schema({
  name: { type: String, required: true},
  content: String,
  phase_id: { type: String, required: true},
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Instruction', InstructionSchema);
