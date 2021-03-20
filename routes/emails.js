var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
let aws = require('aws-sdk');
// var cron = require('node-cron');
var Email = require('../models/Email.js');

//Access Key ID:
//    AKIAI2AHW3UEQ6T56HKA
//Secret Access Key:
//    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

// configure AWS SDK
// aws.config.loadFromPath('config.json');
// var myCredentials = new AWS.CognitoIdentityCredentials({IdentityPoolId:'IDENTITY_POOL_ID'});
// // var myConfig = new AWS.Config({
// //     credentials: myCredentials, region: 'us-east-1'
// // });

aws.config.update({
    accessKeyId: 'AKIAI2AHW3UEQ6T56HKA',
    secretAccessKey: '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',
    region: 'us-east-2'
});

// aws.config.getCredentials(function(err) {
//     if (err) console.log(err.stack);
//     // credentials not loaded
//     else {
//         console.log("Access key:", AWS.config.credentials.accessKeyId);
//     }
// });

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

    // create Nodemailer SES transporter
    let transporter = nodemailer.createTransport({
        SES: new aws.SES({ region: 'us-east-2', apiVersion: "2010-12-01" })

    });

// send some mail
    transporter.sendMail({
        from: 'danielleford04@gmail.com',
        to: 'danielleford04@gmail.com',
        subject: 'Message',
        text: 'I hope this message gets sent!',
        ses: { // optional extra arguments for SendRawEmail
        }
    }, (err, info) => {
        console.log(err, info)
        // console.log(info.envelope);
        // console.log(info.messageId);
    });

});

/* UPDATE EMAIL */
router.put('/:id', function(req, res, next) {
  Email.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
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
