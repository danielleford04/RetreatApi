var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
let aws = require('aws-sdk');
var Retreatant = require('../models/Retreatant.js');
var Email = require('../models/Email.js');
const sendEmail = require("../email/send");

/* GET ALL RETREATANTS */
router.get('/', function(req, res, next) {
  Retreatant.find(function (err, products) {
    if (err) return next(err);
    res.json(products);
  });
});

/* GET ALL RETREATANTS BY EVENT BY EVENT_ID */
router.get('/event/:event_id', function(req, res, next) {
    Retreatant.find({ event_id: req.params.event_id } , function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET SINGLE RETREATANT BY ID */
router.get('/:id', function(req, res, next) {
  Retreatant.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* CREATE RETREATANT */
router.post('/', function(req, res, next) {
  Retreatant.create(req.body, function (err, post) {
    if (err) return next(err);

      Email.find({ event_id: post.event_id, type: "confirmation" } , function (err, data) {
          if (err) return next(err);
          var confirmationEmail = data[0]

          var emailData = {
              'from': 'danielleford04@gmail.com',
              'to': post.email,
              'subject': confirmationEmail.subject,
              'body': confirmationEmail.body
          };
          sendEmail(emailData)

      });

    res.json(post);
  });
});

/* UPDATE RETREATANT */
router.put('/:id', function(req, res, next) {
  Retreatant.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE RETREATANT */
router.delete('/:id', function(req, res, next) {
  Retreatant.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
