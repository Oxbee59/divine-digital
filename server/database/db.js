const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "forum.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database error:", err.message);
    } else {
        console.log("Connected to Divine Digital Forum database");
    }
});


db.serialize(() => {

    // USERS TABLE
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            email TEXT,
            password TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // POSTS TABLE
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

});

// ADMIN TABLE
db.run(`
CREATE TABLE IF NOT EXISTS admin (
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT,
password TEXT
)
`);
db.get("SELECT * FROM admin WHERE username = 'admin'", (err,row)=>{

if(!row){

const bcrypt = require("bcrypt")

bcrypt.hash("admin123",10,(err,hash)=>{

db.run(
"INSERT INTO admin (username,password) VALUES (?,?)",
["admin",hash]
)

})

}

})

module.exports = db;