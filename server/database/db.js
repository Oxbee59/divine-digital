const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// ✅ Use persistent path for Render (fallback to local)
const dbPath = process.env.DATABASE_URL || path.join(__dirname, "forum.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database error:", err.message);
    } else {
        console.log("Connected to Divine Digital Forum database");
    }
});

db.serialize(() => {

    // ✅ USERS TABLE (UPDATED WITH PHONE)
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            email TEXT,
            phone TEXT,
            password TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // ✅ POSTS TABLE
    db.run(`
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            content TEXT,
            image TEXT,
            video TEXT,
            link TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // ✅ ADMIN TABLE
    db.run(`
        CREATE TABLE IF NOT EXISTS admin (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password TEXT
        )
    `);

    // ✅ CREATE DEFAULT ADMIN IF NOT EXISTS
    db.get("SELECT * FROM admin WHERE username = 'admin'", (err, row) => {
        if (!row) {
            const bcrypt = require("bcrypt");

            bcrypt.hash("admin123", 10, (err, hash) => {
                db.run(
                    "INSERT INTO admin (username,password) VALUES (?,?)",
                    ["admin", hash]
                );
                console.log("Default admin created (username: admin, password: admin123)");
            });
        }
    });

});

module.exports = db;