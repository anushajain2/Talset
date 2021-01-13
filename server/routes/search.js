const express = require("express");
const {loginRequired, ensureCorrectUser} = require("../middleware/auth");
const router = express.Router();

module.exports = router;