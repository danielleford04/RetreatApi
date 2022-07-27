var nodemailer = require('nodemailer');
let aws = require('aws-sdk');
var moment = require('moment');
var File = require('../models/File.js');
var Event = require('../models/Event.js');

const ses = new aws.SES({ region: 'us-east-2'})

module.exports = async function verifyEmailAddress(emailAddress) {

    var params = {
        EmailAddress: emailAddress
    };
    ses.verifyEmailIdentity(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
        /*
        data = {
        }
        */
    });
}
