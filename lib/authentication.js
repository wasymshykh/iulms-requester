// Generation of token by taking username and password
const requester = require("./requester");

const initialToken = async () => {
    // getting initial moodle session for next login post request
    const Sender = new requester(true);
    Sender.set_url("http://iulms.edu.pk/login/index.php");
    Sender.set_host("iulms.edu.pk");
    Sender.set_method("GET");

    let response;
    try {
        response = await Sender.send();
    } catch (err) {
        return {
            success: false,
            message: "Error while requesting for initial request."
        };
    }

    const moodleSession = response.headers["set-cookie"][0]
        .replace("MoodleSession=", "")
        .replace("; path=/", "")
        .trim();

    const moodleSessionTest = response.headers["set-cookie"][1]
        .replace("MoodleSessionTest=", "")
        .replace("; path=/", "")
        .trim();

    return Promise.resolve({
        success: true,
        data: {
            _ga: "GA1.3.1620953679.1551285319",
            moodleSession,
            moodleSessionTest,
            moodleID_: "%25B0%259AG%2519%25E5"
        }
    });
};

const generateToken = async (regno, password) => {
    const initial_cookies = await initialToken();

    if (!initial_cookies.success) {
        return Promise.reject(initial_cookies);
    }

    const Sender = new requester(true);
    Sender.set_url("http://iulms.edu.pk/login/index.php");
    Sender.set_method("POST");
    Sender.set_content_type("application/x-www-form-urlencoded");
    Sender.set_host("iulms.edu.pk");

    Sender.set_origin("http://iulms.edu.pk");
    Sender.set_referer("http://iulms.edu.pk/login/index.php");

    // setting cookies
    const cookies =
        "_ga=" +
        initial_cookies.data._ga +
        "; MOODLEID_=" +
        initial_cookies.data.moodleID_ +
        "; MoodleSession=" +
        initial_cookies.data.moodleSession +
        "; MoodleSessionTest=" +
        initial_cookies.data.moodleSessionTest;
    Sender.set_cookies(cookies);

    // setting data
    const data = {
        username: regno,
        password: password,
        testcookies: 1
    };
    Sender.set_data(data);

    let response;
    try {
        response = await Sender.send();
    } catch (err) {
        if (err.statusCode === 303) {
            // login success redirection 303.
            return Promise.resolve(initial_cookies);
        }

        return Promise.reject({
            success: false,
            message: "Unable to send POST request."
        });
    }
    if (response.statusCode === 200) {
        return Promise.reject({
            success: false,
            message: "Invalid username or password!"
        });
    }

    return Promise.resolve(response);
};

/*
    *
    ** Example Token Gen Func Calling
    *

    generateToken("00000", "00000")
        .then(res => {
            console.log("success!", res);
        })
        .catch(err => {
            console.log("Error!", err);
        });
*/

module.exports.generateToken = generateToken;
