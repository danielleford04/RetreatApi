var mongoose = require("mongoose");

var DefaultSchema = new mongoose.Schema({
    type: { type: String, required: true },
    updated_at: { type: Date, default: Date.now },
    // phases: { type: Array, required: true},
    // user_id: { type: String, required: true}
});

//phases: [{name: 'registration', tasks: [], instructions: [], email: {} }, {name: arrival, tasks: [], instructions: [], email: {}}]

module.exports = mongoose.model("Default", DefaultSchema);

//why not just make the 'default' an event... and get everything the same way....

//user has array defaults: [{type: blah, id: blah},...
//when opening overlay, check user if there are defaults saved
//if not - message
//when opening drop down - fetchPhaseInstructions/tasks/emails like from phase page w default event id
