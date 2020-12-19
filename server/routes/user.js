const express = require("express");
const {loginRequired, ensureCorrectUser} = require("../middleware/auth");
const router = express.Router();
const { getUser, editUser, getAllUsers } = require("../handlers/user");

router.get("/profile/:id", getUser);
router.put("/profile/:id", loginRequired, ensureCorrectUser,editUser);
router.get("/all", getAllUsers);

module.exports = router;