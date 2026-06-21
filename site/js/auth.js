import { supabase } from "./supabase.js";

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const submitButton = document.getElementById("submitButton");
const message = document.getElementById("message");

let signup = false;

if (loginTab) {
    loginTab.onclick = () => {
        signup = false;
        loginTab.classList.add("active");
        signupTab.classList.remove("active");
        confirmContainer.style.display = "none";
        submitButton.textContent = "Login";
    };

    signupTab.onclick = () => {
        signup = true;
        signupTab.classList.add("active");
        loginTab.classList.remove("active");
        confirmContainer.style.display = "block";
        submitButton.textContent = "Create Account";
    };

    submitButton.onclick = async () => {

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        message.textContent = "";

        if (signup) {

            const { error } = await supabase.auth.signUp({
                email,
                password
            });

            if (error) {
                message.textContent = error.message;
                message.classList.add("error");
                return;
            }

            message.textContent =
                "Account created! Check your email.";

        } else {

            const { error } =
                await supabase.auth.signInWithPassword({

                    email,
                    password

                });

            if (error) {

                message.textContent = error.message;
                message.classList.add("error");

                return;

            }

            window.location.href = "index.html";

        }

    };

}
