var express = require('express');
var router = express.Router();
let aws = require('aws-sdk');
const { accessKeyId, secretAccessKey } = require('../email/aws_keys');
var mongoose = require('mongoose');
var Email = require('../models/Email.js');

aws.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: 'us-east-2'
});
const ses = new aws.SES()

/* GET ALL EMAILS */
router.get('/', function(req, res, next) {
  Email.find(function (err, products) {
    if (err) return next(err);
    res.json(products);
  });
});

/* GET SINGLE EMAIL BY ID */
router.get('/:id', function(req, res, next) {
  Email.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET CONFIRMATION EMAIL BY EVENT_ID */
router.get('/confirmation/:event_id', function(req, res, next) {
    Email.find({ event_id: req.params.event_id, type: "confirmation" } , function (err, post) {
        if (err) return next(err);
        res.json(post[0]);
    });
});

/* GET ALL EMAILS BY PHASE BY PHASE_ID */
router.get('/phase/:phase_id', function(req, res, next) {
    Email.find({ phase_id: req.params.phase_id } , function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});


/* SAVE EMAIL */
router.post('/', function(req, res, next) {
  Email.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SEND EMAIL */
router.post('/send', function(req, res, next) {
    // TODO: rewrite w email utility

});

/* VERIFY SENDER EMAIL ADDRESS */
router.post('/verify', function(req, res, next) {
    var params = {
        EmailAddress: req.body.email
    };
    ses.verifyEmailIdentity(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
        /*
        data = {
        }
        */
    });
});

/* CHECK IF SENDER EMAIL ADDRESS IS VERIFIED*/
router.get('/verificationStatus/:email_address', function(req, res, next) {
    var params = {
        Identities: [req.params.email_address]
    };
    ses.getIdentityVerificationAttributes(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
        /*
        data = {
        }
        */
    });
});

/* UPDATE EMAIL */
router.put('/:id', function(req, res, next) {
    console.log(1,req.body)
  Email.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, post) {
    if (err) return next(err);
    console.log(post)
    res.json(post);
  });
});

/* DELETE EMAIL */
router.delete('/:id', function(req, res, next) {
  Email.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
