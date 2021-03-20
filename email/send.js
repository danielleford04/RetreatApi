var nodemailer = require('nodemailer');
let aws = require('aws-sdk');

aws.config.update({
    accessKeyId: 'AKIAI2AHW3UEQ6T56HKA',
    secretAccessKey: 'AFS/dlf0McPHfCAAtQ/q8LdgSoH6hBE+aF7s8IUk',
    region: 'us-east-2'
});

// Sample email:
// {
//     from: 'danielleford04@gmail.com',
//         to: 'danielleford04@gmail.com',
//     subject: 'Message',
//     text: 'I hope this message gets sent!',
//     ses: { // optional extra arguments for SendRawEmail
// }

module.exports = function sendEmail(emailData) {

    // create Nodemailer SES transporter
    let transporter = nodemailer.createTransport({
        SES: new aws.SES({ region: 'us-east-2', apiVersion: "2010-12-01" })

    });

// send some mail
    transporter.sendMail({
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.body,
        ses: { // optional extra arguments for SendRawEmail
        }
    }, (err, info) => {
        console.log(err, info)
        // console.log(info.envelope);
        // console.log(info.messageId);
    });


}
