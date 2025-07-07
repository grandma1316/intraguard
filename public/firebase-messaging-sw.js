importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js");

// Initialize Firebase in Service Worker
firebase.initializeApp({
    apiKey: "AIzaSyB76rv9x0pi6cf9Ba1fb4Nx5oQ_idb59Es",
    authDomain: "integraguard-525e3.firebaseapp.com",
    projectId: "integraguard-525e3",
    storageBucket: "integraguard-525e3.appspot.com",
    messagingSenderId: "831390005885",
    appId: "1:831390005885:web:a3b080705e85c4a9c68f14",
    measurementId: "G-ZW4J4P3LCC",
});

// Initialize Messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message', payload);

    const notificationTitle = payload.notification?.title || 'Background Message';
    const notificationOptions = {
        body: payload.notification?.body || 'You have a new message.',
        icon: '/firebase-logo.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
}); 