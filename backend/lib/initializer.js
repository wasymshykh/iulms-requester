const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

const env_path = path.join(__dirname, "..", "/.env");

const get_config = () => {
    result = dotenv.config({ path: env_path });
    if (result.error) {
        throw result.error;
    }

    return {
        host: process.env.SMTP_AUTH_HOST,
        port: process.env.SMTP_AUTH_PORT,
        user: process.env.SMTP_AUTH_USER,
        pass: process.env.SMTP_AUTH_PASS,
        receiver_email: process.env.RECEIVER_MAIL,
        sender_name: process.env.SENDER_NAME,
        sender_email: process.env.SENDER_MAIL
    };
};

const re_config = () => {
    const env = dotenv.parse(fs.readFileSync(env_path));
    for (let key in env) {
        if (env.hasOwnProperty(key)) {
            process.env[key] = env[key];
        }
    }

    return get_config();
};

module.exports.config = get_config;
module.exports.reload = re_config;
