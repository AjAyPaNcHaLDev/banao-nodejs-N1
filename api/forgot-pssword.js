const express = require("express");
const router = express.Router();
const User = require("../db/UserSchema");
const Const = require("../constant");
const encrypte = require("../encrypte");
// api for forgot-password.
router.get("/api/forgot-password", (req, res) => {
  let { Username = "", Email = "" } = req.query;
  if (Username != "" || Email != "") {
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

    User.findOne({ $or: [{ Username }, { Email }] }).then((result) => {
      if (result == null) {
        res.send({ Msg: "User Not Found" });
        return;
      }

      let { Name, Username, Email, Password, _id } = result;

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
      Password = encrypte.decryptData(
        Password,
        Const.encryptionKey,
        encrypte.initializationVector
      );

      res.send({
        Msg: `Hi! ${Name} We are sending your password to your registerd Email ${Email} please check it.`,
        Name: Name,
        Username: Username,
        Email: Email,
        Note: ` Note: Password to user email are not send it just a demo how forgot password work `,
        EmailHtml: `hi!,<b>${Name}</b><br> <h4>Username:${Username} <h4><br><h4>Password: ${Password}</h4> Please Do Not share your pasword to anyone Thank You...`,
      });
    });
  } else {
    res.send({ Msg: "Please provide Username or Email" });
  }
});
module.exports = router;
