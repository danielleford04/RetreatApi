var nodemailer = require('nodemailer');
let aws = require('aws-sdk');
const ses = new aws.SES()
var moment = require('moment');
const { accessKeyId, secretAccessKey } = require('./aws_keys');
var File = require('../models/File.js');
var Event = require('../models/Event.js');

aws.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: 'us-east-2'
});

//required: event_id

// Sample email:
// {
//     from: 'danielleford04@gmail.com',
//         to: 'danielleford04@gmail.com',
//     subject: 'Message',
//         text: text,                      // plaintext version
//     html: '<div>' + text + '</div>', // html version
//     attachments: [{
//          filename: 'text3.txt',
//         path: '/path/to/file.txt' // stream this file
//     }]
// }



module.exports = async function sendEmail(emailData) {
    let email_body;
    let event_date;
    let email_data = {
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        text: null,
    }

    function getEventInfo(id) {
        return Event.findById(id).exec()
    }
    let event_info = await getEventInfo(emailData.event_id);

    if (event_info.type === "daylong") {
        event_date = moment(event_info.start_date).format('MMMM Do, YYYY')
    } else {
        event_date = `${moment(event_info.start_date).format('MMMM Do, YYYY')} - ${moment(event_info.end_date).format('MMMM Do, YYYY')}`
    }
    let template_variable_info = {
        eventName: event_info.name,
        eventDate: event_date
    }
    email_body = emailData.body;


    email_body = emailData.body.replace(/{([^{}]+)}/g, function(keyExpr, key) {
        return template_variable_info[key] || "";
    });

    email_data.text = email_body;

    let attachment_paths = [];

    if (emailData.attachment.length > 0) {
        for (let attachment of emailData.attachment) {
            let file_info = await getFileInfo(attachment)
               let attachment_data = {
                   filename: file_info.name,
                   path: `./Uploads/${file_info.file_name}`
               }
               attachment_paths.push(attachment_data)
        }
        email_data.attachments = attachment_paths;

    }

    function getFileInfo(id) {
        return File.findById(id).exec()
    }

    // create Nodemailer SES transporter
    let transporter = nodemailer.createTransport({
        SES: new aws.SES({ region: 'us-east-2', apiVersion: "2010-12-01" })

    });



// send some mail
    transporter.sendMail(
        email_data
    , (err, info) => {
        console.log(err, info)
        // console.log(info.envelope);
        // console.log(info.messageId);
    });


}
