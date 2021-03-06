const express = require("express");
const router = express.Router();

const { getTutorial } = require("../controllers/tutorial");

router.get("/url", getTutorial);


module.exports = router;