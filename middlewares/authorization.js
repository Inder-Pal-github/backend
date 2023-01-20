const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorization = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    // check is token is present in headers.
    if (!token) {
      return res.status(401).json({ message: "Not authorized!" });
    }
    token = req.headers.authorization.split(" ")[1];
    // verify token;
    const isTokenValid = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!isTokenValid) {
      return res.status(401).json({ message: "Not authorized!" });
    }
    // console.log(isTokenValid);
    req.userId = isTokenValid.userId;
    req.email = isTokenValid.email;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong, please try again.",error:error.message });
  }
};
module.exports = { authorization };
