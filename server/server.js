const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./database/db");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts")

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes)

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.static(path.join(__dirname, "../client")));
app.use("/admin", express.static(path.join(__dirname, "../admin")));

const PORT = 3000;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.listen(PORT, () => {
    console.log("Divine Digital Forum running on port " + PORT);
});