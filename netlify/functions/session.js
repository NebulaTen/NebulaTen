const crypto = require("crypto");

const COOKIE_NAME = "captcha_session";

function sign(data) {
    return crypto
        .createHmac("sha256", process.env.SESSION_SECRET)
        .update(data)
        .digest("hex");
}

exports.handler = async (event) => {

    const cookies = event.headers.cookie || "";

    const match = cookies
        .split(";")
        .map(x => x.trim())
        .find(x => x.startsWith(COOKIE_NAME + "="));


    if (!match) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                valid: false
            })
        };
    }


    const value = match.split("=")[1];

    const parts = value.split(".");

    if (parts.length !== 2) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                valid: false
            })
        };
    }


    const timestamp = parts[0];
    const signature = parts[1];


    const expected = sign(timestamp);


    if (signature !== expected) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                valid: false
            })
        };
    }


    // 24 hours
    if (Date.now() - Number(timestamp) > 86400000) {

        return {
            statusCode: 200,
            body: JSON.stringify({
                valid: false
            })
        };

    }


    return {
        statusCode: 200,
        body: JSON.stringify({
            valid: true
        })
    };
};
