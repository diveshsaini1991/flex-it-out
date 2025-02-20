require('dotenv').config();
const jwt = require('jsonwebtoken');


const authenticateToken = async(req, res, next) => {
  // const token = req.cookies.token;
  const token =
			req.cookies.token ||
			req.body.token ||
			req.header("Authorization").replace("Bearer ", "");
  console.log("auth")

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  console.log("auth")

  // jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
  //   if (err) {
  //     return res.status(403).json({ error: 'Invalid token' });
  //   }
  //   req.user = user;
     
  //   next();
  // });
  console.log(token)

  try {

    // Verifying the JWT using the secret key stored in environment variables
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    console.log(decode.id);
    // Storing the decoded JWT payload in the request object for further use
    req.user = decode;
  } catch (error) {
    // If JWT verification fails, return 401 Unauthorized response
    return res
      .status(401)
      .json({ success: false, message: "token is invalid" });
  }

  // If JWT is valid, move on to the next middleware or request handler
  next();
};

module.exports = authenticateToken;