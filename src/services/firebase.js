import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyB76rv9x0pi6cf9Ba1fb4Nx5oQ_idb59Es",
  authDomain: "integraguard-525e3.firebaseapp.com",
  projectId: "integraguard-525e3",
  storageBucket: "integraguard-525e3.appspot.com",
  messagingSenderId: "831390005885",
  appId: "1:831390005885:web:a3b080705e85c4a9c68f14",
  measurementId: "G-ZW4J4P3LCC",
  databaseURL: "https://integraguard-525e3-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);
export const messaging = getMessaging(app);

// Request notification permission and get token
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY' // You'll need to add your VAPID key here
      });
      return token;
    }
    return null;
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
};

// Listen for foreground messages
export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};

export default app; 