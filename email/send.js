var nodemailer = require("nodemailer");
let AWS = require("aws-sdk");
var moment = require("moment");
var File = require("../models/File.js");
var Event = require("../models/Event.js");

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

async function createEmail(retreatants, emailData) {
    const emails = retreatants.map((r) => r.email);

    let email_body;
    let event_date;

    const emailParams = {
        from: emailData.sender_email_verified,
        to: emails,
        subject: emailData.subject,
        body: emailData.body,
        event_id: emailData.event_id,
    };

    if (emailData.attachment) {
        emailParams.attachment = emailData.attachment;
    }

    function getEventInfo(id) {
        return Event.findById(id).exec();
    }
    let event_info = await getEventInfo(emailParams.event_id);

    if (event_info.type === "daylong") {
        event_date = moment(event_info.start_date).format("MMMM Do, YYYY");
    } else {
        event_date = `${moment(event_info.start_date).format("MMMM Do, YYYY")} - ${moment(event_info.end_date).format(
            "MMMM Do, YYYY"
        )}`;
    }
    let template_variable_info = {
        eventName: event_info.name,
        eventDate: event_date,
    };
    email_body = emailParams.body;

    email_body = emailParams.body.replace(/{([^{}]+)}/g, function (keyExpr, key) {
        return template_variable_info[key] || "";
    });

    emailParams.text = email_body;

    // let attachment_paths = [];

    // if (emailParams.attachment && emailParams.attachment.length > 0) {
    //     for (let attachment of emailParams.attachment) {
    //         let file_info = await getFileInfo(attachment)
    //            let attachment_data = {
    //                filename: file_info.name,
    //                path: `./Uploads/${file_info.file_name}`
    //            }
    //            attachment_paths.push(attachment_data)
    //     }
    //     emailParams.attachments = attachment_paths;
    // }

    // function getFileInfo(id) {
    //     return File.findById(id).exec()
    // }
    return emailParams;
}

async function sendEmail(emailData) {
    // create Nodemailer SES transporter
    let transporter = nodemailer.createTransport({
        SES: new AWS.SES({ region: "us-east-2", apiVersion: "2010-12-01" }),
    });
    // send some mail
    return await transporter.sendMail(emailData);
}

module.exports = {
    createEmail,
    sendEmail,
};
