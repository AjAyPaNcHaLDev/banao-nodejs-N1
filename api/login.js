const express = require("express");
const router = express.Router();
const User = require("../db/UserSchema");
const jwt = require("jsonwebtoken");
const Const = require("../constant");
const encrypte = require("../encrypte");
/*
In this file check Email or Username & Password then assign a jwt token for the user
*/

// api for login user.
router.get("/api/login", async (req, res) => {
  console.log("login");
  let { Username = "", Email = "", Password } = req.query;

  // perform encrypte to match the data to the b/w encrypted data.
  Username = encrypte.encryptData(
    Username,
    Const.encryptionKey,
    encrypte.initializationVector
  );

  Email = encrypte.encryptData(
    Email,
    Const.encryptionKey,
    encrypte.initializationVector
  );
  Password = encrypte.encryptData(
    Password,
    Const.encryptionKey,
    encrypte.initializationVector
  );
  console.log("step", 1);
  await User.findOne({
    $and: [
      {
        $or: [{ Username }, { Email }],
      },
      { Password },
    ],
  }).then((result) => {
    if (!result) {
      res.send({ Msg: "User Not Registerd Please register First then try" });
      return;
    }
    console.log("step", 2);

    let { Name, Username, Email, _id } = result;

    Username = encrypte.decryptData(
      Username,
      Const.encryptionKey,
      encrypte.initializationVector
    );
    Email = encrypte.decryptData(
      Email,
      Const.encryptionKey,
      encrypte.initializationVector
    );
    Name = encrypte.decryptData(
      Name,
      Const.encryptionKey,
      encrypte.initializationVector
    );
    console.log("step", 3);
    // assign jwt token or create a new jwt token for newly logined user
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
        console.log("step", 4);
        const hostname = req.hostname;
        const protocol = req.protocol;
        res.send({
          token,
          Msg: "Auth Success,This is The JWT Token use this token to get the user info",
          acesssWithToken: `${protocol}://${hostname}:${Const.port}/?token=${token}`,
        });
      }
    );
  });
});
module.exports = router;
