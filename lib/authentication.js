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

    return {
        success: true,
        data: {
            _ga: "GA1.3.1620953679.1551285319",
            moodleSession,
            moodleSessionTest,
            moodleID_: "%25B0%259AG%2519%25E5"
        }
    };
};

const generateToken = async () => {
    const intial_cookies = await initialToken();
    console.log(intial_cookies);

    // sending request
};

generateToken();
