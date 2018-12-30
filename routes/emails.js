var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
// var cron = require('node-cron');
var Email = require('../models/Email.js');


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
router.post('/send', function(req,res,next) {
//     console.log(1)
//     // create reusable transporter object using the default SMTP transport
//     var transporter = nodemailer.createTransport('smtps://danielleford04%40gmail.com:NeoDiamoa44@smtp.gmail.com');
//
//     var mailOptions = req.body;
//     console.log(mailOptions)
//
// // create template based sender function
//     var sendTemplateEmail = transporter.sendMail({
//         subject: mailOptions.subject,
//         text: mailOptions.text,
//         html: mailOptions.html
//     }, {
//         from: mailOptions.from,
//     });
//
// // use template based sender to send a message
//     sendTemplateEmail({
//         to: mailOptions.to
//     }, mailOptions.context, function(err, info){
//         if(err){
//             console.log('Error');
//         }else{
//             console.log('Message sent: ' + info.response);
//             // res.send(info)
//
//             var newEmail = new Email({
//                 date			: new Date(),
//                 recipients		: mailOptions.to
//             })
//
//             newEmail.save( function(err, doc){
//                 res.send(doc)
//             } )
//         }
//     });

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
//     nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        // let transporter = nodemailer.createTransport({
        //     host: 'smtp.ethereal.email',
        //     port: 587,
        //     secure: false, // true for 465, false for other ports
        //     auth: {
        //         user: account.user, // generated ethereal user
        //         pass: account.pass // generated ethereal password
        //     }
        // });
        console.log(req.body)
        let transporter = nodemailer.createTransport('smtps://danielleford04%40gmail.com:NeoDiamoa44@smtp.gmail.com');

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: 'danielleford04@gmail.com', // list of receivers
            subject: req.body.subject, // Subject line
            text: req.body.body, // plain text body
            html: req.body.body // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            res.send(info)
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    // });
})

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
