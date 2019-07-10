const rp = require("request-promise");
const cheerio = require("cheerio");

let sic =
    "http://iulms.edu.pk/registration/Registration_FEST_student_EarlyRegistration.php";

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
        const $ = cheerio.load(res);

        let form = $("form").find("table");
        form = form.next();
        form = form.next();
        form = form.next();
        form = form.next();

        while (form.html()) {
            html_main_table = form.html();
            const $$ = cheerio.load(html_main_table);

            let tr = $$("table").find("tr");

            let isFirst = true;

            while (tr.html()) {
                let td = tr.find("td");

                let i = 0;
                let stringToBe = "";
                let tr_itrate = true;
                while (td.html()) {
                    let td_text = td.html().trim();

                    if (i == 0 && td_text.indexOf("<input") == -1) {
                        tr_itrate = false;
                    }

                    if (tr_itrate) {
                        // 3:CH; 4:Name; 6:Teacher; 7:Time; 8:Strength
                        if (i == 3 || i == 4 || i == 6 || i == 7 || i == 8) {
                            stringToBe += td_text + "||";
                        }
                        td = td.next();
                        i++;
                    } else {
                        break;
                    }
                }
                console.log("STT:::" + stringToBe);

                //console.log(tr.html());

                tr = tr.next();
                isFirst = false;
            }

            form = form.next();
            break;
        }
    })
    .catch(err => {
        console.error(err);
    });
