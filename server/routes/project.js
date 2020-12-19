const express = require("express");
const router = express.Router();

const { getProject, saveProject} = require("../handlers/project");
const { loginRequired, ensureCorrectUser} =require("../middleware/auth")

router.get("/new/:id", loginRequired, ensureCorrectUser, getProject);
router.post("/new/:id", loginRequired, ensureCorrectUser, saveProject);

module.exports = router;