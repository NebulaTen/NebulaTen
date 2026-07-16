const crypto = require("crypto");

const COOKIE_NAME = "captcha_session";

function createSignature(timestamp) {

    return crypto
        .createHmac(
            "sha256",
            process.env.SESSION_SECRET
        )
        .update(timestamp)
        .digest("hex");

}



exports.handler = async (event) => {


    const cookies =
        event.headers.cookie || "";



    const cookie = cookies
        .split(";")
        .map(x => x.trim())
        .find(
            x => x.startsWith(
                COOKIE_NAME + "="
            )
        );



    if (!cookie) {

        return {

            statusCode: 200,

            headers: {
                "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

                valid: false

            })

        };

    }



    const value =
        cookie.split("=")[1];



    const parts =
        value.split(".");


    if (parts.length !== 2) {

        return {

            statusCode: 200,

            body: JSON.stringify({

                valid:false

            })

        };

    }



    const timestamp =
        parts[0];


    const signature =
        parts[1];



    const expected =
        createSignature(timestamp);



    if (
        !crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expected)
        )
    ) {

        return {

            statusCode:200,

            body:JSON.stringify({

                valid:false

            })

        };

    }



    const age =
        Date.now() -
        Number(timestamp);



    // 24 hours

    if (age > 86400000) {


        return {

            statusCode:200,

            body:JSON.stringify({

                valid:false

            })

        };

    }



    return {

        statusCode:200,

        headers:{
            "Content-Type":
            "application/json"
        },

        body:JSON.stringify({

            valid:true

        })

    };

};
