const rp = require("request-promise");

let sic = "http://iulms.edu.pk/login/index.php";

const send_request = async url => {
    let html = await rp(url, {
        headers: {
            Cookie:
                "_ga=GA1.3.1620953679.1551285319; MOODLEID_=%25B0%259AG%2519%25E5",
            Host: "iulms.edu.pk",
            "User-Agent":
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
        },
        resolveWithFullResponse: true
    });
    return html;
};

send_request(sic)
    .then(res => {
        const moodleSession = res.headers["set-cookie"][0]
            .replace("MoodleSession=", "")
            .replace("; path=/", "")
            .trim();

        const moodleSessionTest = res.headers["set-cookie"][1]
            .replace("MoodleSessionTest=", "")
            .replace("; path=/", "")
            .trim();

        let options = {
            method: "POST",
            uri: "http://iulms.edu.pk/login/index.php",
            formData: {
                username: "00000",
                password: "00000",
                testcookies: 1
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Cookie:
                    "_ga=GA1.3.1620953679.1551285319; MOODLEID_=%25B0%259AG%2519%25E5; MoodleSession=" +
                    moodleSession +
                    "; MoodleSessionTest=" +
                    moodleSessionTest,
                Host: "iulms.edu.pk",
                Origin: "http://iulms.edu.pk",
                Referer: "http://iulms.edu.pk/login/index.php",
                "User-Agent":
                    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
            }
        };
        rp(options)
            .then(response => {
                console.log("Invalid login details!");
            })
            .catch(err => {
                if (err.statusCode == 303) {
                    console.log("Authenticated Cookies ---");
                    console.log("MoodleSession: " + moodleSession);
                    console.log("MoodleSessionTest: " + moodleSessionTest);
                } else {
                    console.error("Login post request failed!");
                }
            });
    })
    .catch(err => {
        console.error("iulms is unreachable.");
    });
