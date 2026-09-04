// ==========================================
// ONCOGUIDE AI - LOGIN
// ==========================================

const SUPABASE_URL =
    "https://oboegmpghqvfvflbuofe.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_5ST9dwNzfV57ewEkRtMNyg_u0q81vIt";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ==========================================
// GET FORM ELEMENTS
// ==========================================

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginButton =
    document.querySelector(".login-button");


// ==========================================
// LOGIN
// ==========================================

loginButton.addEventListener("click", async function () {

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    // Validation
    if (!email) {
        alert("Please enter your email.");
        return;
    }

    if (!password) {
        alert("Please enter your password.");
        return;
    }


    loginButton.disabled = true;

    loginButton.innerHTML =
        'Logging in... <i class="fa-solid fa-spinner fa-spin"></i>';


    try {

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });


        if (error) {

            console.error(
                "Login error:",
                error
            );

            alert(error.message);

            return;
        }


        console.log(
            "Login successful:",
            data
        );

        alert(
            `Welcome back, ${data.user.user_metadata.full_name || "User"}!`
        );


        // Redirect after successful login
        window.location.href =
            "main.html";

    }

    catch (error) {

        console.error(
            "Unexpected login error:",
            error
        );

        alert(
            "Something went wrong. Please try again."
        );

    }

    finally {

        loginButton.disabled = false;

        loginButton.innerHTML =
            'Login <i class="fa-solid fa-arrow-right"></i>';

    }

});


// ==========================================
// PASSWORD VISIBILITY
// ==========================================

const passwordEye =
    document.querySelector(".input-box .fa-eye");

if (passwordEye) {

    passwordEye.addEventListener(
        "click",
        function () {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                passwordEye.classList.remove(
                    "fa-eye"
                );

                passwordEye.classList.add(
                    "fa-eye-slash"
                );

            } else {

                passwordInput.type = "password";

                passwordEye.classList.remove(
                    "fa-eye-slash"
                );

                passwordEye.classList.add(
                    "fa-eye"
                );
            }
        }
    );
}