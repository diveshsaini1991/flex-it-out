const express = require("express");
const router = express.Router();
const { getUserChallenges, joinChallenge, createChallenge,completeChallenge } = require("../controllers/challenges.controller.js");
const { authenticateToken } = require("../middleware/authentication.js");

router.get("/", authenticateToken, getUserChallenges); 
router.post("/join/:challengeId", authenticateToken, joinChallenge);
router.post("/create",   createChallenge);
router.post('/complete/:challengeId',  completeChallenge);


module.exports = router;
