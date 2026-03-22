const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const db = require("../database/db")

/* STORAGE SETTINGS */

const storage = multer.diskStorage({

destination: function(req,file,cb){

if(file.mimetype.startsWith("image")){
cb(null,"uploads/images")
}else if(file.mimetype.startsWith("video")){
cb(null,"uploads/videos")
}

},

filename: function(req,file,cb){

const uniqueName = Date.now() + path.extname(file.originalname)
cb(null,uniqueName)

}

})

const upload = multer({storage})

/* CREATE POST */

router.post("/create", upload.fields([
{name:"image"},
{name:"video"}
]), (req,res)=>{

const {title,content,link} = req.body

let image = null
let video = null

if(req.files["image"]){
image = req.files["image"][0].filename
}

if(req.files["video"]){
video = req.files["video"][0].filename
}

db.run(

`INSERT INTO posts (title,content,image,video,link) VALUES (?,?,?,?,?)`,
[title,content,image,video,link],

function(err){

if(err){
return res.json({success:false})
}

res.json({success:true})

}

)

})

/* GET POSTS */

router.get("/all",(req,res)=>{

db.all("SELECT * FROM posts ORDER BY id DESC",(err,rows)=>{

res.json(rows)

})

})

/* GET USERS */

router.get("/users",(req,res)=>{

db.all("SELECT id,username,email FROM users",(err,rows)=>{

res.json(rows)

})

})

module.exports = router