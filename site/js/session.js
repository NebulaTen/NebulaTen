import { supabase } from "./supabase.js";

export async function getSession() {

    const {
        data: { session },
        error
    } = await supabase.auth.getSession();

    if (error) {
        console.error(error);
        return null;
    }

    return session;

}

export async function isLoggedIn() {

    const session = await getSession();

    return session !== null;

}

export async function getUser() {

    const session = await getSession();

    return session ? session.user : null;

}
