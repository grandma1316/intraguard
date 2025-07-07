import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// 1️⃣ Your Firebase config

    const firebaseConfig = {
apiKey: "AIzaSyB76rv9x0pi6cf9Ba1fb4Nx5oQ_idb59Es",
authDomain: "integraguard-525e3.firebaseapp.com",
projectId: "integraguard-525e3",
storageBucket: "integraguard-525e3.appspot.com",
messagingSenderId: "831390005885",
appId: "1:831390005885:web:a3b080705e85c4a9c68f14",
measurementId: "G-ZW4D4P3LCC"
};
// 2️⃣ Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 3️⃣ Once auth state is known, set the <img> src with both device & user_id
onAuthStateChanged(auth, user => {
  if (!user) {
    // not logged in → back to login
    window.location.href = "index.html";
    return;
  }
  const uid    = user.uid;
  const params = new URLSearchParams(window.location.search);
  const device = params.get("device") || 0;

  const img = document.getElementById("liveFeed");
  img.src = `http://localhost:5000/video_feed?device=${encodeURIComponent(device)}&user_id=${encodeURIComponent(uid)}`;
});

// 4️⃣ Stop backend capture when going back
document.getElementById("backButton").addEventListener("click", async e => {
  e.preventDefault();
  try {
    await fetch("http://localhost:5000/stop-capture", { method: "POST" });
  } catch {}
  window.location.href = "golive.html";
});
