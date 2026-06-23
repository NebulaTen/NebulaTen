import { supabase } from "./supabase.js";

const {
    data:{session}
} = await supabase.auth.getSession();

if(!session){

    location.href="login.html";

    throw new Error("Not logged in");

}

const user = session.user;

const usernameEl =
document.getElementById("username");

const emailEl =
document.getElementById("email");

const shardsEl =
document.getElementById("shards");

const joinedEl =
document.getElementById("joined");

const avatarEl =
document.getElementById("avatar");

const logoutBtn =
document.getElementById("logoutBtn");

emailEl.textContent =
user.email;

const { data,error } =
await supabase
.from("profiles")
.select("*")
.eq("id",user.id)
.single();

if(error){

    console.error(error);

}else{

    usernameEl.textContent =
    data.username;

    shardsEl.textContent =
    data.shards;

    joinedEl.textContent =
    new Date(
        data.created_at
    ).toLocaleDateString();

    if(data.avatar_url){

        avatarEl.src =
        data.avatar_url;

    }

}

logoutBtn.onclick = async()=>{

    await supabase.auth.signOut();

    location.href="index.html";

};
