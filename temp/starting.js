const reg = require("../backend/lib/registrations");
const auth = require("../backend/lib/authentication");
const chalk = require("chalk");

const login = {
    username: "00000",
    password: "00000"
};

const authentication = async () => {
    try {
        return await auth.generateToken(login.username, login.password);
    } catch (err) {
        return err;
    }
};

const registration = async token => {
    try {
        return await reg.getCourses(token);
    } catch (err) {
        return err;
    }
};

const course_data_handler = courses => {
    const available_courses = courses.filter(course => {
        return course.type === "available";
    });
    const available_unchecked_courses = available_courses.filter(course => {
        return course.type === "available" && course.checked == false;
    });

    available_unchecked_courses.forEach(course => {
        console.log(
            chalk.white.bgRed(" Available Unchecked ") +
                ": " +
                chalk.red(course.course_name)
        );
    });
};

const repeater = async (token, login_again) => {
    if (token === undefined || login_again) {
        console.log("Authenticating...");
        token = await authentication();
        if (!token.success) {
            return console.log("⚠️ Error!", token.message);
        }
    }

    const data = await registration(token.data);
    if (data.success !== undefined && !data.success) {
        if (data.message.toLowerCase() === "login expired!") {
            return repeater(token, true);
        } else {
            return console.log("⚠️ Error!", data.message);
        }
    }

    course_data_handler(data.courses);

    console.log("⏳ waiting for another request to be sent... \n");

    setTimeout(async () => {
        repeater(token, false);
    }, 90000);
};

console.log("Started 🚀");
repeater();
