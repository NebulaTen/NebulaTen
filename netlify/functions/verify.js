exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: "Method Not Allowed"
        };
    }

    try {
        const { token } = JSON.parse(event.body || "{}");

        if (!token) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    error: "Missing token"
                })
            };
        }

        const params = new URLSearchParams({
            secret: process.env.HCAPTCHA_SECRET,
            response: token
        });

        const response = await fetch(
            "https://hcaptcha.com/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: params.toString()
            }
        );

        const result = await response.json();

        if (!result.success) {
            return {
                statusCode: 403,
                body: JSON.stringify({
                    success: false,
                    errors: result["error-codes"] || []
                })
            };
        }

        // Cookie valid for 24 hours
        return {
            statusCode: 200,
            headers: {
                "Set-Cookie":
                    "captcha_verified=true; HttpOnly; Secure; SameSite=Lax; Max-Age=86400; Path=/"
            },
            body: JSON.stringify({
                success: true
            })
        };

    } catch (err) {

        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: err.message
            })
        };
    }
};
