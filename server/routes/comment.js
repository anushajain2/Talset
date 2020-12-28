const express = require("express");
const router = express.Router();
const {loginRequired, ensureCorrectUser} = require("../middleware/auth");
const {createComment, getAllComments, newReply, getReplyAndComment, likeComment} = require("../handlers/comment");

router.post("/newComment/:id", loginRequired, createComment);
router.get("/all/:id", getAllComments);
router.post("/newReply/:id", loginRequired, newReply);
router.get("/reply/:id", getReplyAndComment);
router.post("/likeComment/:id", loginRequired, likeComment);

module.exports = router;