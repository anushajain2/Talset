const express = require("express");
const router = express.Router();

const { getNewProject, saveNewProject, getAllProjects} = require("../handlers/project");
const { loginRequired, ensureCorrectUser} =require("../middleware/auth")

router.get("/new/:id", loginRequired, ensureCorrectUser, generateProject);
router.post("/new/:id", loginRequired, ensureCorrectUser, createProject);
router.get("/all/:id", getUserProjects);

module.exports = router;