// 1️⃣ Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

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

// 3️⃣ Initialize Firebase Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 4️⃣ REST API base
const API_BASE = "http://127.0.0.1:5000";

// 5️⃣ Track current user
let currentUserId = null;
onAuthStateChanged(auth, user => {
  if (!user) {
    console.log("User not logged in.");
    // optionally: window.location.href = "login.html";
    return;
  }
  currentUserId = user.uid;
  loadUserCameras(currentUserId);
});

// 6️⃣ Open modal & load webcams
document.querySelector(".add-camera-btn")
  .addEventListener("click", () => {
    document.getElementById("cameraModal").style.display = "block";
    loadWebcams();
  });

// 7️⃣ Close modal
window.closeModal = () => {
  document.getElementById("cameraModal").style.display = "none";
};

// 8️⃣ Enumerate webcams
async function loadWebcams() {
  const sel = document.getElementById("webcamSelect");
  sel.innerHTML = "";
  try {
    const devs = await navigator.mediaDevices.enumerateDevices();
    const vids = devs.filter(d => d.kind === "videoinput");
    if (!vids.length) {
      sel.innerHTML = '<option value="">No webcams found</option>';
      return;
    }
    vids.forEach((d, i) => {
      const opt = document.createElement("option");
      opt.value = d.deviceId;
      opt.text = d.label || `Camera ${i + 1}`;
      sel.appendChild(opt);
    });
  } catch (err) {
    console.error("Error listing webcams:", err);
    sel.innerHTML = '<option value="">Failed to load webcams</option>';
  }
}

// 9️⃣ Handle form submit → POST to /api/cameras/<user_id>
document.getElementById("cameraForm")
  .addEventListener("submit", async e => {
    e.preventDefault();
    const name = document.getElementById("cameraName").value.trim();
    const webcamId = document.getElementById("webcamSelect").value;
    if (!currentUserId) {
      return alert("User not logged in.");
    }
    if (!name || !webcamId) {
      return alert("Both fields are required.");
    }

    try {
      const res = await fetch(
        `${API_BASE}/api/cameras/${currentUserId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          webcamId: webcamId,
          createdAt: new Date().toISOString()
        })
      }
      );
      const body = await res.json();
if (!res.ok) throw new Error(body.error || "Failed to add camera");

// success: update UI
closeModal();
e.target.reset();

// pass the real cameraId returned by your POST
addCameraCard(body.cameraId, { name, webcamId });


    } catch (err) {
      console.error("Error adding camera:", err);
      alert("Error: " + err.message);
    }
  });

// 🔟 Render a single camera card (with delete button)
// …above code remains the same…

// 🔟 Render a single camera card (with Remove button at bottom)
function addCameraCard(cameraId, { name, webcamId }) {
  const container = document.querySelector(".cards");
  if (!container) return;

  // Card wrapper
  const card = document.createElement("div");
  card.className = "card";

  // Camera name
  const p = document.createElement("p");
  p.className = "card-text";
  p.textContent = name;
  card.appendChild(p);

  // Remove button
  const rem = document.createElement("button");
  rem.className = "remove-camera-btn";
  rem.textContent = "Remove Camera";
  rem.addEventListener("click", async e => {
    e.stopPropagation();
    if (!confirm(`Remove "${name}"?`)) return;

    try {
      const res = await fetch(
        `${API_BASE}/api/cameras/${cameraId}`,
        { method: "DELETE" }
      );
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Delete failed");
      card.remove();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Could not remove camera: " + err.message);
    }
  });
  card.appendChild(rem);

  // Click to go to video page
  card.addEventListener("click", () => {
    window.location.href = `video.html?device=${encodeURIComponent(webcamId)}`;
  });

  container.appendChild(card);
}

// …rest of your code…

async function loadUserCameras(userId) {
  try {
    const res = await fetch(`${API_BASE}/api/cameras/${userId}`);
    const data = await res.json();
    const container = document.querySelector(".cards");
    container.innerHTML = "";

    if (!res.ok) {
      throw new Error(data.error || "Failed to fetch cameras");
    }
    if (!data || Object.keys(data).length === 0) {
      container.innerHTML = '<p style="color:white;">No cameras found for this user.</p>';
      return;
    }

    // data is { cameraId1: {...}, cameraId2: {...}, ... }
    Object.entries(data).forEach(([cameraId, cam]) => {
      addCameraCard(cameraId, cam);
    });

  } catch (err) {
    console.error("Error loading cameras:", err);
    const c = document.querySelector(".cards");
    if (c) c.innerHTML = '<p style="color:white;">Error loading cameras.</p>';
  }
}
