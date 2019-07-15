// Todo request-promise methods

const rp = require("request-promise");

class SendReq {
    constructor(fullresponse = false) {
        this.options = {
            headers: {
                "Content-Type": "",
                Cookie: "",
                Host: "",
                "User-Agent": "",
                Origin: "",
                Referer: ""
            },
            resolveWithFullResponse: fullresponse
        };
    }

    // string parameters
    set_content_type(content_type) {
        this.options.headers["Content-Type"] = content_type;
    }

    set_cookies(cookie) {
        this.options.headers["Cookie"] = cookie;
    }

    set_host(host) {
        this.options.headers["Host"] = host;
    }

    set_agent(user_agent) {
        this.options.headers["User-Agent"] = user_agent;
    }

    set_origin(origin) {
        this.options.headers["Origin"] = origin;
    }

    set_referer(referer) {
        this.options.headers["Referer"] = referer;
    }

    send(url) {
        let cond = this.isValid();

        if (cond.valid) {
            const response = rp(url, this.options);
            return response;
        } else {
            return Promise.reject(cond.message);
        }
    }

    isValid() {
        if (this.options.headers["Content-Type"].trim().length < 1) {
            return {
                valid: false,
                message: "Set content_type before sending request!"
            };
        }
        if (this.options.headers["User-Agent"].trim().length < 1) {
            return {
                valid: false,
                message: "Set agent before sending request!"
            };
        }
        if (this.options.headers["Host"].trim().length < 1) {
            return {
                valid: false,
                message: "Set host before sending request!"
            };
        }

        return { valid: true, message: "Valid!" };
    }
}

module.exports = SendReq;
