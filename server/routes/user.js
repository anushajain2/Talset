const express = require("express");
const router = express.Router();
const { getUser, editUser, getAllUsers } = require("../handlers/user");

router.get("/profile/:id", getUser);
router.put("/profile/:id", editUser); // TODO
router.get("/all", getAllUsers);

module.exports = router;