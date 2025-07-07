const API_BASE = "http://127.0.0.1:5000"; // adjust if needed

// Fetch and render users
async function fetchUsers() {
  const res = await fetch(`${API_BASE}/get-users`);
  const users = await res.json();

  const table = document.getElementById("user-table");
  const tbody = document.getElementById("user-table-body");
  tbody.innerHTML = "";

  users.forEach(u => {
    const name  = u.name   || "";
    const email = (u.email === "admin@admin.com") ? "Admin" : u.email;
    const city  = u.city   || "";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${name}</td>
      <td>${email}</td>
      <td>${city}</td>
      <td style="text-align:center">
        <button onclick="editUser('${u.uid}', '${escapeJs(name)}', '${escapeJs(u.email)}', '${escapeJs(city)}')" class="action-btn">Edit</button>
        <button onclick="deleteUser('${u.uid}')" class="action-btn delete">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  table.style.display = users.length ? "table" : "none";
}

// Add new user
async function addUser() {
  const name     = document.getElementById("add-name").value.trim();
  const email    = document.getElementById("add-email").value.trim();
  const password = document.getElementById("add-password").value;
  const city     = document.getElementById("add-city").value.trim();

  if (!name || !email || !password || !city) {
    alert("Please enter Name, Email, Password and City.");
    return;
  }

  const res = await fetch(`${API_BASE}/add-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, city })
  });
  const result = await res.json();
  alert(result.message || result.error);
  fetchUsers();
}

// Delete a user
async function deleteUser(uid) {
  if (!confirm("Are you sure you want to delete this user?")) return;
  const res = await fetch(`${API_BASE}/delete-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid })
  });
  const result = await res.json();
  alert(result.message || result.error);
  fetchUsers();
}

// Edit an existing user
async function editUser(uid, currentName, currentEmail, currentCity) {
  const name  = prompt("Name:", currentName);
  if (name === null) return;
  const email = prompt("Email:", currentEmail);
  if (email === null) return;
  const city  = prompt("City:", currentCity);
  if (city === null) return;

  if (!name.trim() || !email.trim() || !city.trim()) {
    alert("All fields are required.");
    return;
  }

  const res = await fetch(`${API_BASE}/api/users/${uid}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, city })
  });
  const result = await res.json();
  if (res.ok) {
    alert("User updated successfully");
    fetchUsers();
  } else {
    alert("Update failed: " + (result.error || ""));
  }
}

// Logout
function logout() {
  localStorage.removeItem("authToken");
  sessionStorage.removeItem("authToken");
  window.location.href = "login.html";
}

// Utility: escape single quotes in injected JS prompts
function escapeJs(str) {
  return (str||"").replace(/'/g, "\\'");
}

// Wire up and initial load
window.onload      = fetchUsers;
window.addUser     = addUser;
window.deleteUser  = deleteUser;
window.editUser    = editUser;
window.logout      = logout;


