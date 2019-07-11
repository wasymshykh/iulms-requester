const rp = require("request-promise");
const cheerio = require("cheerio");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const chalk = require("chalk");

dotenv.config();

// Array with list of courses you want check if they are available
const wantCourse = [
    "SOFTWARE PROJECT MANAGEMENT",
    "COMMUNICATION SKILLS",
    "DISCRETE STRUCTURE",
    "WEB PROGRAMMING LANGUAGES",
    "SOFTWARE DESIGN & ARCHITECTURE",
    "MOBILE APPLICATION & DEVELOPMENT",
    "TECHNOPRENEURSHIP"
];

// Change to your data
const config = {
    receiver_email: "wasymshykh@gmail.com",
    sender_name: "Wasym",
    sender_email: "wasym@opticaldot.com"
};

const sic =
    "http://iulms.edu.pk/registration/Registration_FEST_student_EarlyRegistration.php";

const send_request = async url => {
    console.log(chalk.white.bgBlue(" Sending Request... "));

    let html = await rp(url, {
        headers: {
            Cookie:
                "_ga=GA1.3.1620953679.1551285319; MoodleSession=" +
                process.env.MOODLE_SESSION +
                "; MoodleSessionTest=" +
                process.env.MOODLE_SESSION_TEST +
                "; MOODLEID_=%25B0%259AG%2519%25E5",
            Host: "iulms.edu.pk",
            "User-Agent":
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
        }
    });

    return html;
};

console.log("Started watching, waiting for interval to send request...");

const re_request = setInterval(() => {
    send_request(sic)
        .then(res => {
            const $ = cheerio.load(res);

            let form = $("form").find("table");
            if (form.length < 1) {
                console.log("Invalid MOODLE_SESSION OR MOODLE_SESSION_TEST");
                clearInterval(re_request);
                process.exit();
            }

            const available = [];

            while (form.html()) {
                html_main_table = form.html();
                const $$ = cheerio.load(html_main_table);

                let tr = $$("table").find("tr");

                while (tr.html()) {
                    let td = tr.find("td");

                    let i = 0;
                    let details = {
                        credithour: false,
                        name: false,
                        teacher: false,
                        timing: false,
                        strength: false
                    };
                    let tr_itrate = true;
                    while (td.html()) {
                        let td_text = td.html().trim();

                        if (i == 0 && td_text.indexOf("<input") == -1) {
                            tr_itrate = false;
                        }

                        if (tr_itrate) {
                            // 3:CH; 4:Name; 6:Teacher; 7:Timing; 8:Strength
                            if (i == 3) details.credithour = td_text;
                            if (i == 4) details.name = td_text;
                            if (i == 6) details.teacher = td_text;
                            if (i == 7) details.timing = td_text;
                            if (i == 8) details.strength = td_text;

                            td = td.next();
                            i++;
                        } else {
                            break;
                        }
                    }
                    if (details.name) {
                        available.push(details);
                    }

                    tr = tr.next();
                }

                form = form.next();
            }

            let available_to_print =
                chalk.white.bgGreen(" Currently Available") + ": ";
            let result = available.find(course => {
                available_to_print += chalk.green(course.name) + ", ";
                return wantCourse.includes(course.name);
            });
            console.log(available_to_print + "\n");

            if (result) {
                // Sending email!

                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_AUTH_HOST,
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.SMTP_AUTH_USER,
                        pass: process.env.SMTP_AUTH_PASS
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });

                transporter.verify(function(err, success) {
                    if (err) {
                        console.error("SMTP Config Incorrect");
                        process.exit();
                    }
                });

                var message = {
                    from:
                        '"' +
                        config.sender_name +
                        '" <' +
                        config.sender_email +
                        ">",
                    to: config.receiver_email,
                    subject: 'Course "' + result.name + '" Open!',
                    text: "Check IULMS...",
                    html: "<p>Check IULMS...</p>"
                };

                transporter.sendMail(message, (err, info) => {
                    if (err) {
                        console.log(
                            chalk.white.bgOrange(" Available Now ") +
                                ": " +
                                chalk.orange(result.name) +
                                ", couldn't send email but register now!\n"
                        );
                    } else {
                        wantCourse.pop(result.name);
                        console.log(
                            chalk.white.bgRed(" Available Now ") +
                                ": " +
                                chalk.red(result.name) +
                                " register now!\n"
                        );
                    }
                });
            }
        })
        .catch(err => {
            console.error("Couldn't reach iulms");
        });
}, 90000);
