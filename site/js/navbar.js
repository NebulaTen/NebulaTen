import { getUser } from "./session.js";

const loginBtn = document.getElementById("loginBtn");
const profileBtn = document.getElementById("profileBtn");

(async () => {

    const user = await getUser();

    if (user) {

        loginBtn.style.display = "none";

        profileBtn.style.display = "inline-flex";

        profileBtn.textContent =
            user.user_metadata?.username ||
            user.email.split("@")[0];

    } else {

        loginBtn.style.display = "inline-flex";

        profileBtn.style.display = "none";

    }

})();
