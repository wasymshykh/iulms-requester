// Returns course list in array form
const requester = require("./requester");
const cheerio = require("cheerio");

const reg_request = async cookies => {
    const Sender = new requester(true);

    Sender.set_url(
        "http://iulms.edu.pk/registration/Registration_FEST_student_EarlyRegistration.php"
    );
    Sender.set_method("GET");
    Sender.set_host("iulms.edu.pk");

    Sender.set_origin("http://iulms.edu.pk");
    Sender.set_referer("http://iulms.edu.pk/sic/sic.php");

    // setting cookies
    const _cookies =
        "_ga=" +
        cookies._ga +
        "; MOODLEID_=" +
        cookies.moodleID_ +
        "; MoodleSession=" +
        cookies.moodleSession +
        "; MoodleSessionTest=" +
        cookies.moodleSessionTest;
    Sender.set_cookies(_cookies);

    let response;
    try {
        response = await Sender.send();
    } catch (err) {
        return {
            success: false,
            message: "Unable to send registration page request."
        };
    }

    return Promise.resolve({
        success: true,
        data: response
    });
};

const tables_finder = (content, selector, finder) => {
    const $ = cheerio.load(content);
    let tables = $(selector).find(finder);
    return tables;
};

/*
    *
    ** Cookie must be passed as object & in given syntax
    *
    
    {
        _ga: "",
        moodleSession: "",
        moodleSessionTest: "",
        moodleID_: ""
    }
*/

const is_valid_cookies = cookies => {
    if (cookies === undefined) {
        return {
            success: false,
            message: "Pass cookies to function"
        };
    }
    if (cookies._ga === undefined) {
        return {
            success: false,
            message: "Cookie object does not contain '_ga' property."
        };
    }
    if (cookies.moodleSession === undefined) {
        return {
            success: false,
            message: "Cookie object does not contain 'moodleSession' property."
        };
    }
    if (cookies.moodleSessionTest === undefined) {
        return {
            success: false,
            message:
                "Cookie object does not contain 'moodleSessionTest' property."
        };
    }
    if (cookies.moodleID_ === undefined) {
        return {
            success: false,
            message: "Cookie object does not contain 'moodleID_' property."
        };
    }
    return { success: true };
};

const getCourses = async cookies => {
    const valid_cookies = is_valid_cookies(cookies);
    if (!valid_cookies.success) {
        return Promise.reject({
            success: false,
            message: valid_cookies.message
        });
    }

    content = await reg_request(cookies);

    if (!content.success) {
        return Promise.reject(content);
    }

    let tables = tables_finder(content.data.body, "form", "table");
    if (tables.length < 1) {
        return Promise.reject({
            success: false,
            message: "Login Expired!",
            more_message: "Tables not found!"
        });
    }

    const type_as_available = ["available", "locked"];
    const courses = [];

    // Looping tables -> semester tables
    while (tables.html()) {
        let tr = tables_finder(tables.html(), "table", "tr");

        // Looping rows -> each course row
        while (tr.html()) {
            let td = tr.find("td");

            let td_count = 0;
            let td_data = {};
            while (td.html()) {
                let td_text = td.html().trim();

                if (td_count == 0) {
                    td_text = td_text.toLowerCase();
                    // course type -> cleared, not offered, pre-req required,available, locked
                    if (td_text.includes("refer below for electives.")) {
                        break;
                    }
                    if (td_text.includes("already cleared.")) {
                        td_data.type = "cleared";
                    }
                    if (td_text.includes("course is not offered.")) {
                        td_data.type = "not offered";
                    }
                    if (td_text.includes('<input type="checkbox"')) {
                        td_data.type = "available";
                        td_data.checked = false;
                        if (td_text.includes("checked")) {
                            td_data.checked = true;
                        }
                    }
                    if (td_text.includes("pre requisite not cleared.")) {
                        td_data.type = "pre-req required";
                    }
                    if (td_text.includes("section is locked.")) {
                        td_data.type = "locked";
                    }
                }
                /*
                 *
                 ** Values at td_count -> 3:CH; 4:Name; 6:Teacher; 7:Timing; 8:Strength
                 *
                 */
                if (td_count == 3) td_data.credithours = td_text;
                if (td_count == 4) td_data.course_name = td_text;

                if (type_as_available.includes(td_data.type)) {
                    if (td_count == 6) td_data.teacher = td_text;
                    if (td_count == 7) td_data.timing = td_text;
                    if (td_count == 8) {
                        let seats_status = td_text.split("/");
                        let available_seats = seats_status[1] - seats_status[0];
                        td_data.strength = {
                            available: available_seats,
                            filled: seats_status[0],
                            total: seats_status[1]
                        };
                    }
                }

                td = td.next();
                td_count++;
            }

            if (td_data.course_name !== undefined) {
                courses.push(td_data);
            }
            tr = tr.next();
        }
        tables = tables.next();
    }

    return Promise.resolve({ courses });
};

/*
    *
    ** Example Get Courses Func Calling
    *
    const eg_cookies = {
        _ga: "",
        moodleSession: "",
        moodleSessionTest: "",
        moodleID_: ""
    };

    getCourses(eg_cookies)
        .then(courses => {
            console.log(courses);
        })
        .catch(err => {
            console.log(err);
        });
*/

module.exports.getCourses = getCourses;
