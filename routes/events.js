var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var moment = require("moment");
var Event = require("../models/Event.js");
var Phase = require("../models/Phase.js");
var Task = require("../models/Task.js");
var Instruction = require("../models/Instruction.js");
var Email = require("../models/Email.js");

/* GET ALL EVENTS */
router.get("/", function (req, res, next) {
    Event.find(function (err, events) {
        if (err) return next(err);
        res.json(events);
    });
});

/* GET ALL EVENTS BY USER*/
router.get("/user/", function (req, res, next) {
    Event.find({ user_id: req.user._id }, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET SINGLE EVENT BY ID */
router.get("/:id", function (req, res, next) {
    Event.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* CREATE EVENT */
router.post("/", function (req, res, next) {
    console.log(req);
    var user_info = req.user;
    var event_type = req.body.type;
    var default_id = null;
    for (let user_default of user_info.defaults) {
        if (user_default.type === event_type) {
            default_id = user_default.id;
        }
    }
    var event_body = req.body;
    event_body.user_id = user_info._id;

    Event.create(event_body, function (err, post) {
        if (err) return next(err);
        var event_id = post._id;
        var event_start_date = post.start_date;
        var registration_id;
        var preparation_id;
        var arrival_id;
        var during_id;
        var closing_id;
        var follow_up_id;

        createEventPhases();

        function createEventPhases() {
            var registration_body = {
                name: "Registration",
                event_id: event_id,
            };
            var preparation_body = {
                name: "Preparation",
                event_id: event_id,
            };
            var arrival_body = {
                name: "Arrival",
                event_id: event_id,
            };
            var during_body = {
                name: "During",
                event_id: event_id,
            };
            var closing_body = {
                name: "Closing",
                event_id: event_id,
            };
            var follow_up_body = {
                name: "Follow Up",
                event_id: event_id,
            };
            Phase.create(registration_body, function (err, post) {
                if (err) return next(err);
                registration_id = post._id;
                Phase.create(preparation_body, function (err, post) {
                    if (err) return next(err);
                    preparation_id = post._id;
                    Phase.create(arrival_body, function (err, post) {
                        if (err) return next(err);
                        arrival_id = post._id;
                        Phase.create(during_body, function (err, post) {
                            if (err) return next(err);
                            during_id = post._id;
                            Phase.create(closing_body, function (err, post) {
                                if (err) return next(err);
                                closing_id = post._id;
                                Phase.create(follow_up_body, function (err, post) {
                                    if (err) return next(err);
                                    follow_up_id = post._id;

                                    if (default_id != null) {
                                        var phases;
                                        var default_registration_id;
                                        var default_preparation_id;
                                        var default_arrival_id;
                                        var default_during_id;
                                        var default_closing_id;
                                        var default_follow_up_id;
                                        Phase.find({ event_id: default_id }, function (err, post) {
                                            if (err) return next(err);
                                            phases = post;

                                            for (let phase of phases) {
                                                if (phase.name == "Registration") {
                                                    default_registration_id = phase._id;
                                                } else if (phase.name == "Preparation") {
                                                    default_preparation_id = phase._id;
                                                } else if (phase.name == "Arrival") {
                                                    default_arrival_id = phase._id;
                                                } else if (phase.name == "During") {
                                                    default_during_id = phase._id;
                                                } else if (phase.name == "Closing") {
                                                    default_closing_id = phase._id;
                                                } else if (phase.name == "Follow Up") {
                                                    default_follow_up_id = phase._id;
                                                }
                                            }

                                            createDefaultTasksInstructionsEmails(
                                                registration_id,
                                                default_registration_id
                                            );
                                            createDefaultTasksInstructionsEmails(
                                                preparation_id,
                                                default_preparation_id
                                            );
                                            createDefaultTasksInstructionsEmails(arrival_id, default_preparation_id);
                                            createDefaultTasksInstructionsEmails(during_id, default_during_id);
                                            createDefaultTasksInstructionsEmails(closing_id, default_closing_id);
                                            createDefaultTasksInstructionsEmails(follow_up_id, default_follow_up_id);
                                        });
                                    }
                                });
                            });
                        });
                    });
                });
            });
        }

        function createDefaultTasksInstructionsEmails(phase_id, default_phase_id) {
            Task.find({ phase_id: default_phase_id }, function (err, post) {
                if (err) return next(err);

                for (let task of post) {
                    let task_body = {
                        name: task.name,
                        phase_id: phase_id,
                        due_date: moment(event_start_date).subtract(task.default_due_date, "days"),
                        complete: 0,
                    };
                    if (task.content) {
                        task_body.content = task.content;
                    }
                    Task.create(task_body, function (err, post) {
                        if (err) return next(err);
                    });
                }
            });

            Instruction.find({ phase_id: default_phase_id }, function (err, post) {
                if (err) return next(err);

                for (let instruction of post) {
                    let instruction_body = {
                        name: instruction.name,
                        phase_id: phase_id,
                    };
                    if (instruction.content) {
                        instruction_body.content = instruction.content;
                    }
                    Instruction.create(instruction_body, function (err, post) {
                        if (err) return next(err);
                    });
                }
            });

            Email.find({ phase_id: default_phase_id }, function (err, post) {
                if (err) return next(err);

                for (let email of post) {
                    let email_body = {
                        name: email.name,
                        subject: email.subject,
                        body: email.body,
                        event_id: event_id,
                        phase_id: phase_id,
                    };
                    if (email.type) {
                        email_body.type = email.type;
                    }
                    Email.create(email_body, function (err, post) {
                        if (err) return next(err);
                    });
                }
            });
        }

        res.json(post);
    });
});

/* UPDATE EVENT */
router.put("/:id", function (req, res, next) {
    Event.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE EVENT */
router.delete("/:id", function (req, res, next) {
    Event.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);

        Phase.deleteMany({ event_id: req.params.id }, function (err) {
            if (err) return handleError(err);
            // deleted at most one tank document
        });
        res.json(post);
    });
});

module.exports = router;
