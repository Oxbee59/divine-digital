const express = require("express");
const router = express.Router();
const db = require("../database/db");
const bcrypt = require("bcrypt");

// -------------------------
// USER SIGNUP
// -------------------------
router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            `INSERT INTO users (username,email,password) VALUES (?,?,?)`,
            [username, email, hashedPassword],
            function(err) {
                if (err) {
                    return res.json({ success:false, message:"User creation failed" });
                }
                res.json({ success:true, message:"User created successfully" });
            }
        );

    } catch(error){
        res.json({ success:false, message:"Server error" });
    }
});

// -------------------------
// USER LOGIN
// -------------------------
router.post("/login", (req,res) => {
    const {email, password} = req.body;

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err,user) => {

            if(!user){
                return res.json({success:false,message:"User not found"});
            }

            const validPassword = await bcrypt.compare(password,user.password);

            if(!validPassword){
                return res.json({success:false,message:"Wrong password"});
            }

            res.json({
                success:true,
                message:"Login successful",
                user:{
                    id:user.id,
                    username:user.username,
                    email:user.email
                }
            });
        }
    );
});

// -------------------------
// ADMIN LOGIN
// -------------------------
router.post("/admin-login", (req,res) => {
    const {username,password} = req.body;

    db.get(
        "SELECT * FROM admin WHERE username = ?",
        [username],
        async (err,admin) => {

            if(!admin){
                return res.json({success:false,message:"Admin not found"});
            }

            const valid = await bcrypt.compare(password,admin.password);

            if(!valid){
                return res.json({success:false,message:"Wrong password"});
            }

            res.json({success:true,message:"Admin login successful"});
        }
    );
});

// -------------------------
// UPDATE USER PROFILE
// -------------------------
router.put("/update/:id", async (req,res) => {
    const {username,email,password} = req.body;
    const id = req.params.id;

    let hashedPassword = null;
    if(password){
        hashedPassword = await bcrypt.hash(password,10);
    }

    db.run(
        `UPDATE users SET username = ?, email = ?, password = COALESCE(?,password) WHERE id = ?`,
        [username,email,hashedPassword,id],
        function(err){
            if(err) return res.json({success:false,message:"Update failed"});
            res.json({success:true,message:"Profile updated"});
        }
    );
});

module.exports = router;