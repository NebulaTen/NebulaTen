const crypto = require("crypto");

const COOKIE_NAME = "captcha_session";

function createSignature(timestamp) {
    return crypto
        .createHmac("sha256", process.env.SESSION_SECRET)
        .update(timestamp)
        .digest("hex");
}

exports.handler = async (event) => {

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                success: false,
                error: "Method not allowed"
            })
        };
    }


    try {

        const { token } = JSON.parse(event.body || "{}");


        if (!token) {
            return {
                statusCode: 400,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    success: false,
                    error: "Missing hCaptcha token"
                })
            };
        }


        // Verify with hCaptcha
        const params = new URLSearchParams();

        params.append(
            "secret",
            process.env.HCAPTCHA_SECRET
        );

        params.append(
            "response",
            token
        );


        const captchaResponse = await fetch(
            "https://hcaptcha.com/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                    "application/x-www-form-urlencoded"
                },
                body: params.toString()
            }
        );


        const captchaResult =
            await captchaResponse.json();



        if (!captchaResult.success) {

            return {
                statusCode: 403,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    success: false,
                    errors:
                    captchaResult["error-codes"] || []
                })
            };

        }



        // Create signed session

        const timestamp =
            Date.now().toString();


        const signature =
            createSignature(timestamp);



        const cookie =
`${COOKIE_NAME}=${timestamp}.${signature}; HttpOnly; Secure; SameSite=Lax; Max-Age=86400; Path=/`;



        return {

            statusCode: 200,

            headers: {

                "Content-Type":
                "application/json",

                "Set-Cookie":
                cookie

            },

            body: JSON.stringify({

                success: true

            })

        };


    } catch (error) {


        return {

            statusCode: 500,

            headers: {

                "Content-Type":
                "application/json"

            },

            body: JSON.stringify({

                success: false,

                error: error.message

            })

        };

    }

};
