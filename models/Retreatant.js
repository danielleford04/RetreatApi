var mongoose = require("mongoose");

var RetreatantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    notes: String,
    event_id: { type: String, required: true },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Retreatant", RetreatantSchema);
