// importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging.js');

// const firebaseConfig = {
//     apiKey: "AIzaSyB76rv9x0pi6cf9Ba1fb4Nx5oQ_idb59Es",
//     authDomain: "integraguard-525e3.firebaseapp.com",
//     projectId: "integraguard-525e3",
//     storageBucket: "integraguard-525e3.appspot.com",
//     messagingSenderId: "831390005885",
//     appId: "1:831390005885:web:a3b080705e85c4a9c68f14",
//     measurementId: "G-ZW4J4P3LCC",
// };

// // Initialize Firebase in the service worker
// firebase.initializeApp(firebaseConfig);

// const messaging = firebase.messaging();

// // Handle background notification
// messaging.onBackgroundMessage(function(payload) {
//     console.log('Received background message ', payload);
//     const notificationTitle = 'New Notification';
//     const notificationOptions = {
//         body: payload.notification.body,
//         icon: payload.notification.icon,
//     };

//     self.registration.showNotification(notificationTitle, notificationOptions);
// });


// // firebase-messaging-sw.js
// importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging.js');

// const firebaseConfig = {
//     apiKey: "AIzaSyB76rv9x0pi6cf9Ba1fb4Nx5oQ_idb59Es",
//     authDomain: "integraguard-525e3.firebaseapp.com",
//     projectId: "integraguard-525e3",
//     storageBucket: "integraguard-525e3.appspot.com",
//     messagingSenderId: "831390005885",
//     appId: "1:831390005885:web:a3b080705e85c4a9c68f14",
//     measurementId: "G-ZW4J4P3LCC",
// };

// // Initialize Firebase in the service worker
// firebase.initializeApp(firebaseConfig);

// // Initialize Firebase Messaging and set up background message handler
// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function(payload) {
//     console.log('[firebase-messaging-sw.js] Received background message ', payload);
//     const notificationTitle = 'Background Message Title';
//     const notificationOptions = {
//         body: payload.notification.body,
//         icon: '/firebase-logo.png',
//     };

//     self.registration.showNotification(notificationTitle, notificationOptions);
// });

// importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging.js');
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
// import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging.js";


// // Initialize Firebase in service worker
// const firebaseConfig = {
//     apiKey: "AIzaSyB76rv9x0pi6cf9Ba1fb4Nx5oQ_idb59Es",
//     authDomain: "integraguard-525e3.firebaseapp.com",
//     projectId: "integraguard-525e3",
//     storageBucket: "integraguard-525e3.appspot.com",
//     messagingSenderId: "831390005885",
//     appId: "1:831390005885:web:a3b080705e85c4a9c68f14",
//     measurementId: "G-ZW4J4P3LCC",
// };

// const app = initializeApp(firebaseConfig);

// // Initialize Firebase Cloud Messaging and handle background notifications
// const messaging = getMessaging(app);

// // Handle background message
// messaging.onBackgroundMessage(function(payload) {
//     console.log('[firebase-messaging-sw.js] Received background message ', payload);
//     // Customize notification here
//     const notificationTitle = 'Background Message Title';
//     const notificationOptions = {
//         body: 'Background message body.',
//         icon: '/firebase-logo.png'
//     };

//     self.registration.showNotification(notificationTitle, notificationOptions);
// });

// importScripts { getMessaging } from "firebase/messaging/sw";
// // importScripts { onBackgroundMessage } from "firebase/messaging/sw";

// importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js");

// const messaging = getMessaging();

// onBackgroundMessage(messaging, (payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   // Customize notification here
//   const notificationTitle = 'Background Message Title';
//   const notificationOptions = {
//     body: 'Background Message body.',
//     icon: '/firebase-logo.png'
//   };

//   self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });

// firebase-messaging-sw.js

// importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js");

// // Initialize the Firebase app in the service worker with the config
// firebase.initializeApp({
//   apiKey: "AIzaSyB76rv9x0pi6cf9Ba1fb4Nx5oQ_idb59Es",
//   authDomain: "integraguard-525e3.firebaseapp.com",
//   projectId: "integraguard-525e3",
//   storageBucket: "integraguard-525e3.appspot.com",
//   messagingSenderId: "831390005885",
//   appId: "1:831390005885:web:a3b080705e85c4a9c68f14",
//   measurementId: "G-ZW4J4P3LCC",
// });

// // Retrieve an instance of Firebase Messaging
// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function(payload) {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);

//   const notificationTitle = payload.notification.title || 'Background Message Title';
//   const notificationOptions = {
//     body: payload.notification.body || 'Background Message body.',
//     icon: '/firebase-logo.png'  // optional
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });


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
