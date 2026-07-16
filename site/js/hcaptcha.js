(() => {

    const SITEKEY = "901a2c36-f0ea-48da-8ca6-e00a86f40046";


    function addStyles() {

        const style = document.createElement("style");

        style.textContent = `

        html.captcha-lock,
        body.captcha-lock {
            overflow:hidden!important;
        }


        #captcha-overlay {

            position:fixed;
            inset:0;

            background:
            rgba(10,5,25,.85);

            backdrop-filter:
            blur(12px);

            display:flex;
            align-items:center;
            justify-content:center;

            z-index:999999999;

        }


        #captcha-box {

            width:420px;
            max-width:90%;

            background:
            linear-gradient(
                145deg,
                #24104f,
                #120827
            );

            color:white;

            padding:35px;

            border-radius:22px;

            text-align:center;

            font-family:
            Arial, sans-serif;

            box-shadow:
            0 20px 60px #0008;

            border:
            1px solid #8b5cff55;

        }


        #captcha-box h2 {

            margin-top:0;

            color:#b98cff;

        }


        #captcha-status {

            margin-top:15px;

            font-size:14px;

            opacity:.8;

        }


        `;

        document.head.appendChild(style);

    }



    function createPopup() {


        document.documentElement.classList.add(
            "captcha-lock"
        );

        document.body.classList.add(
            "captcha-lock"
        );


        const overlay =
            document.createElement("div");


        overlay.id =
            "captcha-overlay";



        overlay.innerHTML = `

        <div id="captcha-box">

            <h2>
                Verification Required
            </h2>

            <p>
                Please complete the CAPTCHA
                to continue.
            </p>


            <div id="captcha-widget"></div>


            <div id="captcha-status">
                Loading...
            </div>

        </div>

        `;


        document.body.appendChild(overlay);


    }




    async function checkSession() {


        try {


            const res =
            await fetch(
                "/.netlify/functions/session",
                {
                    credentials:"include"
                }
            );


            const data =
            await res.json();


            return data.valid === true;


        } catch {

            return false;

        }

    }





    function unlock() {


        document.documentElement.classList.remove(
            "captcha-lock"
        );

        document.body.classList.remove(
            "captcha-lock"
        );


        const overlay =
        document.getElementById(
            "captcha-overlay"
        );


        if (overlay)
            overlay.remove();

    }






    async function verify(token) {


        const status =
        document.getElementById(
            "captcha-status"
        );


        status.textContent =
        "Checking...";



        try {


            const res =
            await fetch(
                "/.netlify/functions/verify",
                {

                    method:"POST",

                    credentials:"include",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },


                    body:
                    JSON.stringify({
                        token
                    })

                }
            );



            const data =
            await res.json();



            if (data.success) {


                status.textContent =
                "Verified!";


                setTimeout(
                    unlock,
                    300
                );


            } else {


                status.textContent =
                "Verification failed.";


                hcaptcha.reset();


            }



        } catch {


            status.textContent =
            "Server error.";


            hcaptcha.reset();


        }

    }





    function loadCaptcha() {


        const wait =
        setInterval(() => {


            if (
                window.hcaptcha &&
                document.getElementById(
                    "captcha-widget"
                )
            ) {


                clearInterval(wait);



                hcaptcha.render(
                    "captcha-widget",
                    {

                        sitekey:SITEKEY,

                        callback:verify,


                        "expired-callback":() => {

                            document.getElementById(
                                "captcha-status"
                            ).textContent =
                            "Expired, retry.";

                        }

                    }
                );


            }


        },100);


    }






    async function start() {


        addStyles();


        const valid =
        await checkSession();



        if (valid)
            return;



        createPopup();


        loadCaptcha();


    }



    window.addEventListener(
        "DOMContentLoaded",
        start
    );


})();
