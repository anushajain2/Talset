const express = require("express");
const {loginRequired, ensureCorrectUser} = require("../middleware/auth");
const router = express.Router();
const {getAllSkills, getOneSkill} = require("../controllers/skill");

router.get("/all", getAllSkills); // todo update postman
router.get("/one/:id", getOneSkill);

module.exports = router;