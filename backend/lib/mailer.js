const nodemailer = require("nodemailer");
const chalk = require("chalk");
const config = require("./initializer");

const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: false,
    auth: {
        user: config.user,
        pass: config.pass
    },
    tls: {
        rejectUnauthorized: false
    }
});

const send_notification = (mail_subject, plaintext, htmlcontent) => {
    transporter.verify(function(err, success) {
        if (err) {
            console.error("SMTP Config Incorrect");
        }
    });

    const message = {
        from: '"' + config.sender_name + '" <' + config.sender_email + ">",
        to: config.receiver_email,
        subject: mail_subject,
        text: plaintext,
        html: htmlcontent
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log("Couldn't send email ");
        } else {
            console.log(chalk.red("Email Sent!"));
        }
    });
};

module.exports = send_notification;
