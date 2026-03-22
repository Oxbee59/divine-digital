// -------------------------
// Admin Login Function
// -------------------------
async function adminLogin() {
    const username = document.getElementById("adminUser").value;
    const password = document.getElementById("adminPass").value;

    const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    document.getElementById("adminMessage").innerText = data.message;

    if (data.success) {
        window.location = "dashboard.html";
    }
}

// -------------------------
// Create Post Function
// -------------------------
async function createPost() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const image = document.getElementById("image").files[0];
    const video = document.getElementById("video").files[0];
    const link = document.getElementById("link").value;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("link", link);

    if (image) formData.append("image", image);
    if (video) formData.append("video", video);

    const res = await fetch("/api/posts/create", {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    if (data.success) {
        alert("Post published");
        loadPosts(); // refresh posts list
    } else {
        alert("Error publishing post");
    }
}

// -------------------------
// Load Users Function
// -------------------------
async function loadUsers() {
    const res = await fetch("/api/posts/users");
    const users = await res.json();

    let html = "";
    users.forEach(u => {
        html += `<p>${u.username} - ${u.email}</p>`;
    });

    document.getElementById("usersList").innerHTML = html;
}

// -------------------------
// Load Posts Function
// -------------------------
async function loadPosts() {
    const res = await fetch("/api/posts/all");
    const posts = await res.json();

    let html = "";
    posts.forEach(p => {
        html += `<div style="border-bottom:1px solid #ccc; padding:10px 0;">
            <h3>${p.title}</h3>
            <p>${p.content}</p>
            ${p.image ? `<img src="/uploads/images/${p.image}" width="200"/>` : ""}
            ${p.video ? `<video width="300" controls><source src="/uploads/videos/${p.video}" type="video/mp4"></video>` : ""}
            ${p.link ? `<p>Link: <a href="${p.link}" target="_blank">${p.link}</a></p>` : ""}
        </div>`;
    });

    document.getElementById("postsList").innerHTML = html;
}

// -------------------------
// Initialize Dashboard
// -------------------------
loadUsers();
loadPosts();