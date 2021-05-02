var nodemailer = require('nodemailer');
let aws = require('aws-sdk');
const { accessKeyId, secretAccessKey } = require('./aws_keys');
var File = require('../models/File.js');

aws.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: 'us-east-2'
});

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
    let email_data = {
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.body,
    }

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
