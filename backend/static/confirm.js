import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js"; 
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB76rv9x0pi6cf9Ba1fb4Nx5oQ_idb59Es",
    authDomain: "integraguard-525e3.firebaseapp.com",
    projectId: "integraguard-525e3",
    storageBucket: "integraguard-525e3.appspot.com",
    messagingSenderId: "831390005885",
    appId: "1:831390005885:web:a3b080705e85c4a9c68f14",
    measurementId: "G-ZW4J4P3LCC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Register the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
            console.log('✅ Service Worker registered with scope:', registration.scope);
            return navigator.serviceWorker.ready;
        })
        .then((registration) => {
            console.log("🟢 Service Worker is ready");
            requestNotificationPermission(registration);
        })
        .catch((error) => {
            console.error('❌ Service Worker registration failed:', error);
        });
}

// Get email from URL params
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get("email");
console.log("Email from URL:", email);
document.getElementById("user-email").textContent = email;

if (!email) {
    alert("No email provided in the URL.");
}

function requestNotificationPermission(serviceWorkerRegistration) {
    Notification.requestPermission()
        .then(permission => {
            if (permission === "granted") {
                getToken(messaging, { serviceWorkerRegistration })
                    .then(token => {
                        console.log("✅ FCM Token:", token);
                        sendTokenToServer(email, token);
                    })
                    .catch(error => {
                        console.error("❌ Error getting FCM token:", error);
                    });
            } else {
                console.error("❌ Notification permission denied");
            }
        })
        .catch(error => {
            console.error("❌ Error requesting permission:", error);
        });
}

function sendTokenToServer(email, token) {

    fetch("https://b529-202-163-119-82.ngrok-free.app/store-fcm-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fcm_token: token })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message || "Error storing FCM token.");
        })
        .catch(error => console.error("Error:", error));
}

window.confirmEmail = requestNotificationPermission;
