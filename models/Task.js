var mongoose = require("mongoose");

var TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  content: String,
  complete: { type: Boolean, required: true },
  due_date: { type: Date },
  default_due_date: { type: Number },
  completed_date: Date,
  phase_id: { type: String, required: true },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", TaskSchema);
