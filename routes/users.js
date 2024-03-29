var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
let aws = require('aws-sdk');
const jwt = require("jsonwebtoken");
var User = require('../models/User.js');
// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const verifyEmailAddress = require("../email/verify");

const ses = new aws.SES()

// @route POST api/users/register
// @desc Register user
// @access Public
// need keys: name, email, password, password2 (must match)
router.post("/register", (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);
// Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        }
        const newUser = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            verified_email_pending: req.body.email,
            password: req.body.password
        });
// Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                    .save()
                    .then(
                        user => {
                            verifyEmailAddress(user.email)
                            res.json(user)
                        }
                    )
                    .catch(err => console.log(err));
            });
        });

});
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    console.log(req.body)
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
// Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
// Find user by email
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }

        if (user.sender_email_pending) {
            var params = {
                Identities: [user.sender_email_pending]
            };
            ses.getIdentityVerificationAttributes(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else
                if (JSON.stringify(data.VerificationAttributes) == '{}' || data.VerificationAttributes[user.sender_email_pending].VerificationStatus === "Success") {
                    User.findOneAndUpdate({ email: user.email }, {sender_email_verified: user.sender_email_pending, sender_email_pending: null}, {new: true}, function (err, post) {
                        if (err) return next(err);

                    });
                } else {
                    verifyEmailAddress(user.sender_email_pending)
                }
            });
        }
// Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name
                };
// Sign token
                jwt.sign(
                    payload,
                    'secret',
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
            }
        });
    });
});

/* GET ALL USERS */
router.get('/', function(req, res, next) {
    User.find(function (err, users) {
        if (err) return next(err);
        res.json(users);
    });
});

/* GET SINGLE USER BY ID */
router.get('/:id', function(req, res, next) {
    User.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        post.password = undefined;
        res.json(post);
    });
});

/* UPDATE USER */
router.put('/:id', async function(req, res, next) {
    if(req.body.password) {req.body.password = await bcrypt.hash(req.body.password, 8)}
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE USER */
router.delete('/:id', function(req, res, next) {
    User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});


module.exports = router;
