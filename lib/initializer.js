const dotenv = require("dotenv");
dotenv.config();

const config = {
    host: process.env.SMTP_AUTH_HOST,
    port: process.env.SMTP_AUTH_PORT,
    user: process.env.process.env.USER,
    pass: process.env.process.env.PASS,
    receiver_email: process.env.RECEIVER_MAIL,
    sender_name: process.env.SENDER_NAME,
    sender_email: process.env.SENDER_MAIL
};

module.exports = config;
