const express = require("express");
const router = express.Router();
const { getChallenges, joinChallenge, createChallenge } = require("../controllers/challenges.controller.js");
const { authenticateToken } = require("../middleware/authentication.js");

router.get("/", authenticateToken, getChallenges); 
router.post("/join", authenticateToken, joinChallenge);
router.post("/create", authenticateToken, createChallenge);

module.exports = router;
