// -------------------------
// USER SIGNUP
// -------------------------
async function signup() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if(!username || !email || !password){
        document.getElementById("message").innerText = "All fields are required!";
        return;
    }

    const res = await fetch("/api/auth/signup",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({username,email,password})
    });

    const data = await res.json();
    document.getElementById("message").innerText = data.message;

    if(data.success){
        // Auto-login user after signup
        localStorage.setItem("user", JSON.stringify({id:null,username,email}));
        // Fetch actual user id from backend to store in localStorage
        const loginRes = await fetch("/api/auth/login", {
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body:JSON.stringify({email,password})
        });
        const loginData = await loginRes.json();
        if(loginData.success){
            localStorage.setItem("user", JSON.stringify(loginData.user));
            window.location = "/"; // redirect to homepage
        }
    }
}

// -------------------------
// USER LOGIN
// -------------------------
async function login(){
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const res = await fetch("/api/auth/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password})
    });

    const data = await res.json();
    document.getElementById("loginMessage").innerText = data.message;

    if(data.success){
        localStorage.setItem("user",JSON.stringify(data.user));
        window.location = "/";
    }
}

// -------------------------
// LOGOUT
// -------------------------
function logout() {
    localStorage.removeItem("user");
    alert("You have been logged out");
    window.location = "/";
}

// -------------------------
// UPDATE PROFILE
// -------------------------
async function updateProfile(){
    const user = JSON.parse(localStorage.getItem("user"));
    if(!user) return;

    const username = document.getElementById("profileUsername").value;
    const email = document.getElementById("profileEmail").value;
    const password = document.getElementById("profilePassword").value;

    const res = await fetch("/api/auth/update/"+user.id,{
        method:"PUT",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({username,email,password})
    });

    const data = await res.json();
    document.getElementById("profileMessage").innerText = data.message;

    if(data.success){
        // Update localStorage
        localStorage.setItem("user",JSON.stringify({id:user.id,username,email}));
        document.getElementById("welcomeMsg").innerText = "Hello, " + username;
    }
}

// -------------------------
// LOAD HOMEPAGE POSTS FEED
// -------------------------
async function loadFeed() {
    const res = await fetch("/api/posts/all");
    const posts = await res.json();

    let html = "";
    posts.forEach(p => {
        html += `<div style="background:white; padding:20px; margin:20px 0; border-radius:8px;">
            <h3>${p.title}</h3>
            <p>${p.content}</p>
            ${p.image ? `<img src="/uploads/images/${p.image}" width="300"/>` : ""}
            ${p.video ? `<video width="400" controls><source src="/uploads/videos/${p.video}" type="video/mp4"></video>` : ""}
            ${p.link ? `<p>Link: <a href="${p.link}" target="_blank">${p.link}</a></p>` : ""}
        </div>`;
    });

    document.getElementById("feedList").innerHTML = html;
}

// -------------------------
// LOAD USERS (for admin dashboard)
// -------------------------
async function loadUsers() {
    const res = await fetch("/api/posts/users");
    const users = await res.json();

    let html = "";
    users.forEach(u=>{
        html += `<p>${u.username} - ${u.email}</p>`;
    });

    const usersList = document.getElementById("usersList");
    if(usersList) usersList.innerHTML = html;
}

// -------------------------
// ADMIN DASHBOARD POSTS
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
    if(image) formData.append("image", image);
    if(video) formData.append("video", video);

    const res = await fetch("/api/posts/create",{
        method:"POST",
        body: formData
    });

    const data = await res.json();
    if(data.success){
        alert("Post published");
        loadPosts(); // refresh dashboard posts
        loadFeed();  // refresh homepage feed for users
    } else {
        alert("Error publishing post");
    }
}

// -------------------------
// LOAD DASHBOARD POSTS
// -------------------------
async function loadPosts() {
    const res = await fetch("/api/posts/all");
    const posts = await res.json();

    let html = "";
    posts.forEach(p=>{
        html += `<div style="border-bottom:1px solid #ccc; padding:10px 0;">
            <h3>${p.title}</h3>
            <p>${p.content}</p>
            ${p.image ? `<img src="/uploads/images/${p.image}" width="200"/>` : ""}
            ${p.video ? `<video width="300" controls><source src="/uploads/videos/${p.video}" type="video/mp4"></video>` : ""}
            ${p.link ? `<p>Link: <a href="${p.link}" target="_blank">${p.link}</a></p>` : ""}
        </div>`;
    });

    const postsList = document.getElementById("postsList");
    if(postsList) postsList.innerHTML = html;
}

// -------------------------
// INITIALIZE PAGE
// -------------------------
window.addEventListener("DOMContentLoaded", ()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    if(user){
        const welcome = document.getElementById("welcomeMsg");
        if(welcome) welcome.innerText = "Hello, " + user.username;

        const signupBox = document.querySelector(".signup-box");
        if(signupBox) signupBox.style.display = "none";
    }

    loadFeed();
    loadUsers();
    loadPosts();
});