const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    sender_email_pending: {
        type: String,
        default: "",
    },
    sender_email_verified: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    defaults: {
        type: Array,
        default: [],
    },
});
module.exports = User = mongoose.model("User", UserSchema);
