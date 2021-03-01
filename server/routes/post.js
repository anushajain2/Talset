const express = require("express");
const router = express.Router();
const multer = require("multer");
const { loginRequired, ensureCorrectUser } = require("../middleware/auth");
const {
    getAllPosts,
    getUserPosts,
    getUserPostsSpecific,
    likePosts,
    trendingPosts,
    viewPost,
    getPostsById,
    incShare,video
} = require("../controllers/post");
const {
    uploadS3,
    fileUploadMiddlewareS3,
    fileDirectUploadMiddlewareS3,
    uploadFrontend,
    newUpload
} = require("../middleware/uploadS3");

const storage = multer.diskStorage({
    destination: "./files",
    filename(req, file, cb) {
        let newName = Date.now() + "-" + file.originalname;
        newName = newName.split(" ").join("_");
        console.log("in multer");
        cb(null, newName);
    },
});

const upload = multer({ storage });

var memoryStorage = multer.memoryStorage();
var form = multer({ storage: memoryStorage });
router.post("/newuploadS3", form.single("files"), newUpload);

// S3
// router.post("/uploadS3/:id", loginRequired, ensureCorrectUser, upload.single('file'), uploadS3);
router.post(
    "/uploadS3/:id",
    loginRequired,
    ensureCorrectUser,
    upload.array("files", 5),
    fileUploadMiddlewareS3
); //add skill learnt, // questions
router.post(
    "/directUploadS3/:id",
    loginRequired,
    ensureCorrectUser,
    form.single("files"),
    newUpload
);
router.post(
    "/createPost/:id",
    loginRequired,
    ensureCorrectUser,
    uploadFrontend
);

router.get("/all", getAllPosts); // getting  skills // questions // username also sending //isliked
router.get(
    "/getById/:id/:postid",
    loginRequired,
    ensureCorrectUser,
    getPostsById
);
router.get("/userPosts/:id", getUserPosts);
router.get("/userPostsWithPostId/:id/:postid", getUserPostsSpecific);
router.post("/like/:id/:postid", loginRequired, ensureCorrectUser, likePosts);
router.get("/trending", trendingPosts);
router.post(
    "/viewPost/:id/:postid",
    loginRequired,
    ensureCorrectUser,
    viewPost
);
router.post("/share/:id/:postid", loginRequired, ensureCorrectUser, incShare);
router.get("/video/:id", video);

// like
// comment
// get post comments
//

module.exports = router;
