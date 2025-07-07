import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// Firebase config (same as elsewhere)
const firebaseConfig = {
  apiKey: "AIzaSyB76rv9x0pi6cf9Ba1fb4Nx5oQ_idb59Es",
  authDomain: "integraguard-525e3.firebaseapp.com",
  projectId: "integraguard-525e3",
  storageBucket: "integraguard-525e3.appspot.com",
  messagingSenderId: "831390005885",
  appId: "1:831390005885:web:a3b080705e85c4a9c68f14",
  measurementId: "G-ZW4D4P3LCC"
};
const API_BASE = "http://127.0.0.1:5000";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let currentUserId = null;
onAuthStateChanged(auth, user => {
  if (!user) {
    console.log("Not logged in, redirecting…");
    window.location.href = "index.html";
    return;
  }
  currentUserId = user.uid;
  loadNotifications();
});

async function loadNotifications() {
  try {
    const res = await fetch(`${API_BASE}/api/notifications/${currentUserId}`);
    const data = await res.json();
    const list = document.getElementById("notifList");
    list.innerHTML = "";

    if (!res.ok) throw new Error(data.error || "Failed to fetch");
    if (!data || Object.keys(data).length === 0) {
      list.innerHTML = "<p style='color:#ccc;'>No notifications yet.</p>";
      return;
    }

    // data: { notifId: {…}, … } sorted by timestamp desc if your API does that
    Object.values(data).forEach(n => {
      const item = document.createElement("div");
      item.className = "notif-item" + (n.read ? "" : " unread");
      item.innerHTML = `
        <h3>${n.title}</h3>
        <p>${n.message}</p>
        <time>${new Date(n.timestamp).toLocaleString()}</time>
      `;
      list.appendChild(item);
    });

  } catch (err) {
    console.error("Error loading notifications:", err);
    document.getElementById("notifList").innerHTML = "<p style='color:red;'>Could not load notifications.</p>";
  }
}
