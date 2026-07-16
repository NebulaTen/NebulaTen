(async () => {

    try {

        const response = await fetch(
            "/.netlify/functions/session",
            {
                credentials: "include"
            }
        );

        const data = await response.json();


        if (!data.valid) {

            window.location.replace(
                "/captcha.html?return=" +
                encodeURIComponent(
                    window.location.pathname
                )
            );

        }

    } catch (e) {

        window.location.replace("/captcha.html");

    }

})();
