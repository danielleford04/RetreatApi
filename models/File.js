var mongoose = require("mongoose");

var FileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    note: String,
    upload_date: { type: Date, required: true },
    file_name: String,
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("File", FileSchema);
