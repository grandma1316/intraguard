// 1️⃣ Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

// 2️⃣ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB76rv9x0pi6cf9Ba1fb4Nx5oQ_idb59Es",
  authDomain: "integraguard-525e3.firebaseapp.com",
  projectId: "integraguard-525e3",
  storageBucket: "integraguard-525e3.appspot.com",
  messagingSenderId: "831390005885",
  appId: "1:831390005885:web:a3b080705e85c4a9c68f14",
  measurementId: "G-ZW4J4P3LCC",
};

// 3️⃣ Initialize Firebase
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getDatabase(app);

// 4️⃣ Keep track of the logged-in user
let currentUserId = null;

// 5️⃣ When auth state changes, fetch & render user name
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // Not logged in, send them to login
    window.location.href = "index.html";
    return;
  }

  currentUserId = user.uid;
  sessionStorage.setItem("userId", currentUserId);

  // pull name (or email) from Realtime Database
  const userSnap = await get(ref(db, `Users/${currentUserId}`));
  const userData = userSnap.exists() ? userSnap.val() : {};
  const displayName = userData.name || user.email;

  // render into welcome-user
  const welcomeEl = document.querySelector(".welcome-user");
  welcomeEl.textContent = `Welcome, ${displayName}`;
});

// 6️⃣ Logout clears session + returns to login
function logout() {
  sessionStorage.removeItem("userId");
  window.location.href = "../index.html";
}
window.logout = logout;
