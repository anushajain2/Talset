const express = require("express");
const router = express.Router();
const multer = require("multer");
const {fileUploadMiddleware} = require("../middleware/upload");
const {loginRequired, ensureCorrectUser} = require("../middleware/auth");
const {getAllPosts, getUserPosts, likePosts} = require("../handlers/post");

const storage = multer.diskStorage({
    destination: './files',
    filename(req, file, cb) {
        let newName = Date.now()+ '-' +file.originalname;
        newName = newName.split(" ").join("_");
        cb(null, newName);
    },
});

const upload = multer({ storage });

router.post("/upload/:id", loginRequired, ensureCorrectUser, upload.array('files', 5), fileUploadMiddleware); //add skill learnt, // questions
router.get("/all", getAllPosts);// getting  skills // questions
router.get("/userPosts/:id", getUserPosts);
router.post("/like/:id", loginRequired, likePosts);

// like
// comment
// get post comments
//

module.exports = router;