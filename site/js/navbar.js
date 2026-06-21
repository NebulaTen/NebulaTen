import { supabase } from "./supabase.js";

const {

data:{session}

}=await supabase.auth.getSession();

const loginBtn=document.getElementById("loginBtn");
const profileBtn=document.getElementById("profileBtn");

if(session){

loginBtn.style.display="none";

profileBtn.style.display="block";

profileBtn.textContent=session.user.email;

}else{

loginBtn.style.display="block";

profileBtn.style.display="none";

}
