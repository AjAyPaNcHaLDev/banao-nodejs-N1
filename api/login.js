const express = require("express");
const router = express.Router();
const User = require("../db/UserSchema");
const jwt = require("jsonwebtoken");
const Const = require("../constant");

/*
In this file check Email or Username & Password then assign a jwt token for the user
*/

// api for login user.
router.get("/api/login", async (req, res) => {
  console.log("login");
  const { Username = "", Email = "", Password } = req.query;

  const hostname = req.hostname;
  const protocol = req.protocol;
  await User.findOne({
    $and: [
      {
        $or: [{ Username }, { Email }],
      },
      { Password },
    ],
  }).then((result) => {
    if (result !== null) {
      const { Name, Username, Email, _id } = result;

      jwt.sign(
        { Name, Username, Email, _id },
        Const.jwtKey,
        { expiresIn: `${1000 * 1000 * 2}s` },
        (err, token) => {
          req.session.user = {
            session: true,
            Name,
            Username,
            Email,
            _id,
            token,
          };
          res.send({
            token,
            Msg: "Auth Success,This is The JWT Token use this token to get the user info",
            acesssWithToken: `${protocol}://${hostname}:${Const.port}/?token=${token}`,
          });
        }
      );
    } else {
      res.send({ Msg: "User Not Registerd Please register First then try" });
    }
  });
});
module.exports = router;
