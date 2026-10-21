const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");
const togglePassword = document.getElementById("toggle-password");
const createAccount = document.getElementById("create-account");

const ACCOUNTS_KEY = "pasigLibraryDemoAccounts";
const SESSION_KEY = "pasigLibraryDemoUser";

const defaultAccounts = [
    { email: "admin@pasiglibrary.edu.ph", password: "Admin123!", role: "admin" },
    { email: "student@pasiglibrary.edu.ph", password: "Student123!", role: "student" }
];

function getAccounts() {
    try {
        const saved = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "null");
        if (Array.isArray(saved)) return saved;
    } catch (error) {
        console.warn("Could not read demo accounts.", error);
    }
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(defaultAccounts));
    return [...defaultAccounts];
}

function showMessage(text, type) {
    message.textContent = text;
    message.className = "message " + type;
}

function clearMessage() {
    message.textContent = "";
    message.className = "message";
}

togglePassword.addEventListener("click", function () {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePassword.textContent = isHidden ? "Hide" : "Show";
    togglePassword.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
});

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearMessage();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!emailInput.checkValidity() || !email) {
        showMessage("Please enter a valid email address.", "error");
        emailInput.focus();
        return;
    }

    if (password.length < 6) {
        showMessage("Password must contain at least 6 characters.", "error");
        passwordInput.focus();
        return;
    }

    const user = getAccounts().find(account =>
        account.email.toLowerCase() === email && account.password === password
    );

    if (!user) {
        showMessage("Incorrect email or password.", "error");
        return;
    }

    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        email: user.email,
        role: user.role
    }));

    window.location.href = user.role === "admin"
        ? "admin-home.html"
        : "index (2).html";
});

createAccount.addEventListener("click", function (event) {
    event.preventDefault();
    clearMessage();

    const email = prompt("Enter the email for your new student account:");
    if (email === null) return;

    const cleanEmail = email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
        showMessage("Please enter a valid email address.", "error");
        return;
    }

    const accounts = getAccounts();
    if (accounts.some(account => account.email.toLowerCase() === cleanEmail)) {
        showMessage("An account with that email already exists.", "error");
        return;
    }

    const password = prompt("Create a password with at least 6 characters:");
    if (password === null) return;

    if (password.length < 6) {
        showMessage("Password must contain at least 6 characters.", "error");
        return;
    }

    accounts.push({ email: cleanEmail, password, role: "student" });
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));

    showMessage("Student account created! You can now log in.", "success");
    emailInput.value = cleanEmail;
    passwordInput.value = "";
    passwordInput.focus();
});
