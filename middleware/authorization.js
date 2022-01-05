const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const cookie = req.cookies.token;

    if (jwt.verify(cookie, process.env.JWT_SECRET)) {
      return next();
    }
  } catch (err) {
    console.error(err.message);
  }
};
