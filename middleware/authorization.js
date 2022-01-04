const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res) => {
  try {
    const cookie = req.cookies.token;

    if (jwt.verify(cookie, process.env.JWT_SECRET)) {
      res.send("all good here");
    }
  } catch (err) {
    console.error(err.message);
  }
};
