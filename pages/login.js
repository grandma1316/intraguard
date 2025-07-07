import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB76rv9x0pi6cf9Ba1fb4Nx5oQ_idb59Es",
    authDomain: "integraguard-525e3.firebaseapp.com",
    projectId: "integraguard-525e3",
    storageBucket: "integraguard-525e3.firebasestorage.app",
    messagingSenderId: "831390005885",
    appId: "1:831390005885:web:a3b080705e85c4a9c68f14",
    measurementId: "G-ZW4J4P3LCC",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function login() {
    const email = document.getElementById("email").value.trim().toLowerCase(); // Ensure lowercase
    const password = document.getElementById("password").value.trim();

    // **Strictly check for admin credentials FIRST**
    if (email === "admin@admin.com" && password === "admin1") {
        console.log("Admin login detected. Redirecting...");
        // alert("Admin login successful");
        window.location.href = "panel.html";
        return; // **Ensure it stops execution here**
    }

    // **If not admin, proceed with Firebase Authentication**
    console.log("Attempting Firebase authentication for user:", email);

    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const user = userCredential.user;
            console.log("Logged in user:", user);
            // alert("Login successful");
            window.location.href = "dashboard.html";
        })
        .catch(error => {
            console.error("Login error:", error);
            alert(error.message);
        });
}

// **Expose login function globally**
window.login = login;