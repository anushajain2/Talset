const express = require("express");
const router = express.Router();
const { getUser, editUser } = require("../handlers/user");

router.get("/profile/:id", getUser);
router.put("/profile/:id", editUser); // TODO

module.exports = router;