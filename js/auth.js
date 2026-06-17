/* ===================================
   BudgetWise Ultra X Pro Max
   Authentication System
=================================== */

class AuthManager {

    constructor() {

        this.currentUser = null;
        this.init();

    }

    /* ==========================
       Initialize Auth
    ========================== */

    init() {

        this.loadSession();
        this.bindEvents();

        console.log(
            "🔐 Authentication System Loaded"
        );

    }

    /* ==========================
       Register User
    ========================== */
      
if (
    !userData.name.trim() ||
    !userData.email.trim() ||
    !userData.password.trim()
) {
    this.showAuthMessage("Please fill all fields", "error");
    return false;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(userData.email)) {
    this.showAuthMessage("Please enter a valid email", "error");
    return false;
}

if (userData.password.length < 8) {
    this.showAuthMessage(
        "Password must be at least 8 characters",
        "error"
    );
    return false;
}
   
   register(userData) {

        const users =
            JSON.parse(
                localStorage.getItem("bw_users")
            ) || [];

        const exists =
            users.find(
                user =>
                    user.email ===
                    userData.email
            );

        if (exists) {

            this.showAuthMessage(
                "Email already registered",
                "error"
            );

            return false;

        }

        const newUser = {

            id: Date.now(),

            name: userData.name,

            email: userData.email,

            password: btoa(
                userData.password
            ),

            createdAt:
                new Date().toISOString(),

            membership: "Free",

            avatar:
                "assets/avatars/default.png"

        };

        users.push(newUser);

        localStorage.setItem(
            "bw_users",
            JSON.stringify(users)
        );

        this.showAuthMessage(
            "Account Created Successfully"
            "success"
        );

        return true;

    }

      this.currentUser = newUser;

localStorage.setItem(
    "bw_current_user",
    JSON.stringify(newUser)
);

localStorage.setItem(
    "bw_logged_in",
    "true"
);

    /* ==========================
       Login User
    ========================== */

    login(email, password) {

        const users =
            JSON.parse(
                localStorage.getItem("bw_users")
            ) || [];

        const user =
            users.find(
                item =>
                    item.email === email &&
                    atob(item.password) === password
            );

        if (!user) {

            this.showAuthMessage(
                "Invalid Email or Password",
                "error"
            );

            return false;

        }

        this.currentUser = user;

        localStorage.setItem(
            "bw_current_user",
            JSON.stringify(user)
        );

        localStorage.setItem(
            "bw_logged_in",
            "true"
        );

       localStorage.setItem(
    "bw_last_login",
    new Date().toISOString()
);

        this.showAuthMessage(
            "Login Successful",
            "success"
        );

        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 1000);

        return true;

    }

    /* ==========================
       Logout
    ========================== */

    logout() {

        localStorage.removeItem(
            "bw_current_user"
        );

        localStorage.removeItem(
            "bw_logged_in"
        );

        this.currentUser = null;

        window.location.href =
            "index.html";

    }

    /* ==========================
       Session
    ========================== */

    loadSession() {

        const user =
            localStorage.getItem(
                "bw_current_user"
            );

        if (user) {

            this.currentUser =
                JSON.parse(user);

        }

    }

    isLoggedIn() {

        return (
            localStorage.getItem(
                "bw_logged_in"
            ) === "true"
        );

    }

    /* ==========================
       Forgot Password
    ========================== */

    resetPassword(
        email,
        newPassword
    ) {

        let users =
            JSON.parse(
                localStorage.getItem(
                    "bw_users"
                )
            ) || [];

        const index =
            users.findIndex(
                user =>
                    user.email === email
            );

        if (index === -1) {

            this.showAuthMessage(
                "Email Not Found",
                "error"
            );

            return false;

        }

        users[index].password =
            btoa(newPassword);

        localStorage.setItem(
            "bw_users",
            JSON.stringify(users)
        );

        this.showAuthMessage(
            "Password Updated",
            "success"
        );

        return true;

    }

    /* ==========================
       Update Profile
    ========================== */

    updateProfile(data) {

        let users =
            JSON.parse(
                localStorage.getItem(
                    "bw_users"
                )
            ) || [];

        const index =
            users.findIndex(
                user =>
                    user.id ===
                    this.currentUser.id
            );

        if (index === -1) return;

        users[index] = {
            ...users[index],
            ...data
        };

        localStorage.setItem(
            "bw_users",
            JSON.stringify(users)
        );

        localStorage.setItem(
            "bw_current_user",
            JSON.stringify(
                users[index]
            )
        );

        this.currentUser =
            users[index];

        this.showAuthMessage(
            "Profile Updated",
            "success"
        );

    }

    /* ==========================
       Delete Account
    ========================== */

    deleteAccount() {

        let users =
            JSON.parse(
                localStorage.getItem(
                    "bw_users"
                )
            ) || [];

        users = users.filter(
            user =>
                user.id !==
                this.currentUser.id
        );

        localStorage.setItem(
            "bw_users",
            JSON.stringify(users)
        );

        this.logout();

    }

    /* ==========================
       Remember Me
    ========================== */

    rememberUser(email) {

        localStorage.setItem(
            "bw_remember_user",
            email
        );

    }

    getRememberedUser() {

        return localStorage.getItem(
            "bw_remember_user"
        );

    }

    clearRememberedUser() {

        localStorage.removeItem(
            "bw_remember_user"
        );

    }

    /* ==========================
       UI Messages
    ========================== */

    showAuthMessage(
        message,
        type = "success"
    ) {

        const container =
            document.getElementById(
                "authMessage"
            );

        if (!container) {

            console.log(message);
            return;

        }

        container.textContent = message;

        container.className =
            `alert alert-${type}`;

        setTimeout(() => {

            container.textContent = "";

            container.className = "";

        }, 3000);

    }

    /* ==========================
       Bind Forms
    ========================== */

    bindEvents() {

        const loginForm =
            document.getElementById(
                "loginForm"
            );

        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                e => {

                    e.preventDefault();

                    const email =
                        document.getElementById(
                            "email"
                        ).value;

                    const password =
                        document.getElementById(
                            "password"
                        ).value;

                    this.login(
                        email,
                        password
                    );

                }
            );

        }

        const signupForm =
            document.getElementById(
                "signupForm"
            );

        if (signupForm) {

            signupForm.addEventListener(
                "submit",
                e => {

                    e.preventDefault();

                    const userData = {

                        name:
                            document.getElementById(
                                "name"
                            ).value,

                        email:
                            document.getElementById(
                                "email"
                            ).value,

                        password:
                            document.getElementById(
                                "password"
                            ).value

                    };

                    this.register(
                        userData
                    );

                }
            );

        }

    }

}

/* ==========================
   Initialize Auth
========================== */

const auth =
    new AuthManager();

/* ==========================
   Global Access
========================== */

window.auth = auth;

window.logout =
    () => auth.logout();
