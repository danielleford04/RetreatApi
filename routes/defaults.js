var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Default = require('../models/Default.js');
var Phase = require('../models/Phase.js');
var User = require('../models/User.js');
var Email = require('../models/Email.js');

/* GET ALL DEFAULTS */
router.get('/', function(req, res, next) {
    Default.find(function (err, products) {
        if (err) return next(err);
        res.json(products);
    });
});

/* GET ALL DEFAULTS BY USER */
router.get('/user/:user_id', function(req, res, next) {
    Default.find({ user_id: req.params.user_id } , function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET SINGLE DEFAULT BY ID */
router.get('/:id', function(req, res, next) {
    Default.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* CREATE DEFAULT */
router.post('/', function(req, res, next) {
    var user_info = req.user;
    var user_response;
    Default.create(req.body, function (err, post) {
        if (err) return next(err);

        let default_id = post._id;
        let registration_default_id;

        createEventPhases();
        addToUserDefaults();


        function createEventPhases() {
            var registration_body = {
                'name': "Registration",
                'event_id': post._id
            };
            var preparation_body = {
                'name': "Preparation",
                'event_id': post._id
            };
            var arrival_body = {
                'name': "Arrival",
                'event_id': post._id
            };
            var during_body = {
                'name': "During",
                'event_id': post._id
            };
            var closing_body = {
                'name': "Closing",
                'event_id': post._id
            };
            var follow_up_body = {
                'name': "Follow Up",
                'event_id': post._id
            };
            Phase.create(registration_body, function (err, post) {
                if (err) return next(err);
                registration_default_id = post._id;
                addDefaultConfirmationEmail();
                Phase.create(preparation_body, function (err, post) {
                    if (err) return next(err);
                    Phase.create(arrival_body, function (err, post) {
                        if (err) return next(err);
                        Phase.create(during_body, function (err, post) {
                            if (err) return next(err);
                            Phase.create(closing_body, function (err, post) {
                                if (err) return next(err);
                                Phase.create(follow_up_body, function (err, post) {
                                    if (err) return next(err);

                                });
                            });
                        });
                    });
                });
            });
        }
        function addToUserDefaults() {
            var user_id = user_info._id;
            var defaults_info = {type: req.body.type, id: post._id};
            if (user_info.defaults) {
                user_info.defaults.push(defaults_info)
            } else {
                user_info.defaults = [defaults_info]
            }
            User.findByIdAndUpdate(user_id, user_info, {new: true}, function (err, post) {
                // user_response = post;
                if (err) return next(err);
                res.json(post)
            });
        }

        function addDefaultConfirmationEmail() {
            var email_data = {
                'phase_id': registration_default_id,
                'event_id': default_id,
                'subject': 'default confirmation email',
                'body': 'default body',
                'type': 'confirmation',
                'name': 'confirmation email'
            };

            Email.create(email_data, function (err, post) {
                if (err) return next(err);
            });
        }
        //returns user response w defaults updated in user info
        // res.json(user_response);
    });
});

/* UPDATE DEFAULT */
router.put('/:id', function(req, res, next) {
    Default.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE DEFAULT */
router.delete('/:id', function(req, res, next) {
    Default.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;
