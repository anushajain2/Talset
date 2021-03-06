const express = require("express");
const multer = require("multer");
const {loginRequired, ensureCorrectUser} = require("../middleware/auth");
const router = express.Router();
const { getUser, editUser, getAllUsers, bookmark, watchLater, follow, putPostProgress, getPostProgress, postCompleted } = require("../controllers/user");
const { uploadS3 } = require("../middleware/uploadS3");

const storage = multer.diskStorage({
    destination: "./files",
    filename(req, file, cb) {
        let newName = Date.now() + "-" + file.originalname;
        newName = newName.split(" ").join("_");
        cb(null, newName);
    },
});

const upload = multer({ storage });

router.get("/profile/:id", getUser);
router.put("/profile/:id", loginRequired, ensureCorrectUser,editUser);
router.get("/all", getAllUsers);
router.post("/bookmark/:id/:postid", loginRequired, ensureCorrectUser, bookmark);
router.post("/watchLater/:id/:postid", loginRequired, ensureCorrectUser, watchLater);
router.post("/follow/:id/:followid", loginRequired, ensureCorrectUser, follow);
router.get("/progress/:id/:postid", loginRequired, ensureCorrectUser, getPostProgress);
router.post("/progress/:id/:postid", loginRequired, ensureCorrectUser, putPostProgress);
router.post("/postCompleted/:id/:postid", loginRequired, ensureCorrectUser, postCompleted); // remove the learning mins update postman
router.post("/uploadProfilePic/:id", loginRequired, ensureCorrectUser, upload.single('file'), uploadS3);
// post completed
// pushing skill learnt, skill and subtopic after user watches a post
module.exports = router;