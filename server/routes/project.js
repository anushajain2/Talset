const express = require("express");
const router = express.Router();

const { getNewProject, saveNewProject, getAllProjects} = require("../handlers/project");
const { loginRequired, ensureCorrectUser} =require("../middleware/auth")

router.get("/new/:id", loginRequired, ensureCorrectUser, getNewProject);
router.post("/new/:id", loginRequired, ensureCorrectUser, saveNewProject);
router.get("/all/:id", getAllProjects);

module.exports = router;