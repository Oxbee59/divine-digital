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

/* ✅ FIX 1: Allow images, videos, scripts (CSP fix for Render) */
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src * 'self' data: blob:; img-src * data: blob:; media-src * data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline';"
    );
    next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

/* ✅ FIX 2: Serve uploads correctly */
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/* ✅ FIX 3: Serve frontend */
app.use(express.static(path.join(__dirname, "../client")));

/* ✅ FIX 4: Clean admin route */
app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/admin/dashboard.html"));
});

/* ✅ Home route */
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

/* ✅ IMPORTANT: Render dynamic port */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Divine Digital Forum running on port " + PORT);
});