import { isLoggedIn } from "./session.js";

(async()=>{

    if(await isLoggedIn()) return;

    if(sessionStorage.getItem("nebulaGuestPopup")) return;

    sessionStorage.setItem("nebulaGuestPopup","shown");

    document.body.insertAdjacentHTML("beforeend",`

<div id="guestPopup">

<div class="popup">

<h2>Welcome to Nebula!</h2>

<p>

You're currently browsing as a guest.

Create an account or login to unlock every feature.

</p>

<ul>

<li>💎 Shard Shop Purchases</li>

<li>☁️ Cloud Saves</li>

<li>👤 Personal Profile</li>

<li>🎒 Inventory</li>

<li>⚙️ Saved Settings</li>

</ul>

<div class="popupButtons">

<button id="popupLogin">

Login

</button>

<button id="popupContinue">

Continue as Guest

</button>

</div>

</div>

</div>

`);

    document
    .getElementById("popupLogin")
    .onclick=()=>{

        location.href="login.html";

    };

    document
    .getElementById("popupContinue")
    .onclick=()=>{

        document
        .getElementById("guestPopup")
        .remove();

    };

})();
