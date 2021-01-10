const express = require("express");
const {loginRequired, ensureCorrectUser} = require("../middleware/auth");
const router = express.Router();
const {getAllSkills, getOneSkill} = require("../handlers/skill");

router.get("/all", getAllSkills);
router.get("/one/:id", getOneSkill);

module.exports = router;