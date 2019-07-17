const rp = require("request-promise");

class SendReq {
    constructor(fullresponse = false) {
        this.options = {
            uri: "",
            method: "",
            headers: {
                Cookie: "",
                Host: "",
                "User-Agent":
                    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36",
                Origin: "",
                Referer: ""
            },
            resolveWithFullResponse: fullresponse
        };
    }

    // string parameters
    set_url(url) {
        this.options.uri = url;
    }

    set_method(method) {
        this.options.method = method;
    }

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

    send() {
        let cond = this.isValid();

        if (cond.valid) {
            const response = rp(this.options);
            return response;
        } else {
            return Promise.reject(cond.message);
        }
    }

    set_data(data) {
        this.options.formData = data;
    }

    isValid() {
        if (this.options.uri.trim().length < 1) {
            return {
                valid: false,
                message: "Set url before sending request!"
            };
        }
        if (this.options.method.trim().length < 1) {
            return {
                valid: false,
                message: "Set method before sending request!"
            };
        }
        if (
            this.options.method == "POST" &&
            this.options.headers["Content-Type"] === undefined
        ) {
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
