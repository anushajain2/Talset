const express = require("express");
const {loginRequired, ensureCorrectUser} = require("../middleware/auth");
const router = express.Router();
const {searchTopPosts, searchAllPosts, searchTopUsers, searchAllUsers} = require("../handlers/search");

router.get("/topPosts", searchTopPosts);
router.get("/allPosts", searchAllPosts);
router.get("/topUsers", searchTopUsers);
router.get("/allUsers", searchAllUsers);

module.exports = router;