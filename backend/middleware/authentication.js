require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.cookies.admintoken;

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("decoded",decoded)

    if (!req.user.role || (req.user.role !== "admin" && req.user.role !== "user")) {
      return res.status(403).json({ error: "Invalid role" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token is invalid" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Only admins can perform this action." });
  }
  next();
};


module.exports = { 
  authenticateToken,
  isAdmin
 };
