import { supabase } from "./supabase.js";

const {
    data:{session}
}=await supabase.auth.getSession();

if(session) return;

if(sessionStorage.getItem("guestPopup")) return;

sessionStorage.setItem("guestPopup","1");

document.body.insertAdjacentHTML("beforeend",`

<div id="guestPopup">

<div class="popup">

<h2>Welcome!</h2>

<p>

You're browsing as a guest.

</p>

<ul>

<li>❌ Cloud Saves</li>

<li>❌ Shard Shop Purchases</li>

<li>❌ Profile</li>

<li>❌ Inventory</li>

</ul>

<div class="buttons">

<button id="loginNow">

Login

</button>

<button id="continueGuest">

Continue as Guest

</button>

</div>

</div>

</div>

`);

loginNow.onclick=()=>{

location.href="login.html";

}

continueGuest.onclick=()=>{

guestPopup.remove();

}
