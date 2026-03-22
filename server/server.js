const express = require("express");
const cors = require("cors");
const path = require("path");

// Routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Static folders
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.static(path.join(__dirname, "../client")));

// ✅ FIX: Correct admin path (inside client/admin)
app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/admin/dashboard.html"));
});

// Home route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

// ✅ IMPORTANT: Render dynamic port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Divine Digital Forum running on port " + PORT);
});