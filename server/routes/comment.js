const express = require("express");
const router = express.Router();
const {loginRequired, ensureCorrectUser} = require("../middleware/auth");
const {createComment, getAllComments, newReply, getReplyAndComment} = require("../handlers/comment");

router.post("/newComment/:id", loginRequired, createComment);
router.get("/all/:id", getAllComments);
router.post("/newReply/:id", loginRequired, newReply);
router.get("/reply/:id", getReplyAndComment);

module.exports = router;