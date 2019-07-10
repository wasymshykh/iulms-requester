const rp = require("request-promise");

let sic = "http://iulms.edu.pk/sic/sic.php";

const send_request = async url => {
    let html = await rp(url, {
        headers: {
            Cookie:
                "_ga=GA1.3.1620953679.1551285319; MoodleSession=; MoodleSessionTest=; MOODLEID_=%25B0%259AG%2519%25E5",
            Host: "iulms.edu.pk",
            "User-Agent":
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
        }
    });

    return html;
};

send_request(sic)
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.error(err);
    });
