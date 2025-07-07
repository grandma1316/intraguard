// profile.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB76rv9x0pi6cf9Ba1fb4Nx5oQ_idb59Es",
  authDomain: "integraguard-525e3.firebaseapp.com",
  projectId: "integraguard-525e3",
  storageBucket: "integraguard-525e3.appspot.com",
  messagingSenderId: "831390005885",
  appId: "1:831390005885:web:a3b080705e85c4a9c68f14",
  measurementId: "G-ZW4J4P3LCC",
};

const API_BASE = "http://127.0.0.1:5000";

initializeApp(firebaseConfig);
const auth = getAuth();

onAuthStateChanged(auth, user => {
  if (!user) {
    // not logged in, send back to login
    window.location.href = "index.html";
    return;
  }
  const uid = user.uid;
  fetchProfile(uid);
  fetchDetections(uid);
});

async function fetchProfile(uid) {
  try {
    const res = await fetch(`${API_BASE}/api/user/${uid}`);
    if (!res.ok) throw new Error("Failed to load profile");
    const { name, email, city } = await res.json();
    document.getElementById("name").value  = name;
    document.getElementById("email").value = email;
    document.getElementById("city").value  = city;
  } catch (e) {
    console.error(e);
    alert("Error loading your profile");
  }
}
async function fetchDetections(uid) {
  try {
    const res = await fetch(`${API_BASE}/api/detections/${uid}`);
    if (!res.ok) throw new Error("Failed to load detections");
    const dets = await res.json();
    const list = document.getElementById("detection-list");
    list.innerHTML = "";
    // dets is { detId: {timestamp,object_class}, … }
    Object.values(dets).forEach(d => {
      const li = document.createElement("li");
      const time = new Date(d.timestamp).toLocaleString();
      li.textContent = `${time}: ${d.object_class}`;
      list.appendChild(li);
    });
  } catch (e) {
    console.error(e);
    document.getElementById("detection-list").innerHTML =
      "<li>Error loading detection history</li>";
  }
}
