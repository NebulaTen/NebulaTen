import { supabase } from "./supabase.js";

export async function logout(){

    await supabase.auth.signOut();

    location.href="index.html";

}
