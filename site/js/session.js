import { supabase } from "./supabase.js";

const {

    data: { session }

} = await supabase.auth.getSession();

if(session){

    console.log(session.user);

}
