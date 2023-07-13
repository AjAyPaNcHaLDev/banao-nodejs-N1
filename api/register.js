const express = require("express");
const router = express.Router();
const User = require("../db/UserSchema");
const Const = require("../constant");
const encrypte = require("../encrypte");
/* In This file this pont has been cover while register new User.

Check Empty field if any filed empty its reject the user registration.
Check Already registred email or username if already registred then reject the user registration.
AtLast all check it register the user.

*/

// api for register.
router.get("/api/register", async (req, res) => {
  let { Name = "", Username = "", Email = "", Password = "" } = req.query;
  if (Username != "" || Email != "" || Name !== "" || Password !== "") {
    // perform encrypte to match the data to the b/w encrypted data.

    Username = encrypte.encryptData(
      Username,
      Const.encryptionKey,
      encrypte.initializationVector
    );
    Name = encrypte.encryptData(
      Name,
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

    try {
      const check = await User.findOne({
        $or: [{ Username }, { Email }],
      });

      if (check != null) {
        res.send({ Msg: "Already register User" });
        console.log({ Msg: "Already resister User" });
        return;
      }
      const register = new User({ Name, Username, Email, Password });
      register
        .save()
        .then((result) => {
          let { Username, Email, Name } = result;
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

          res.send({ Name, Username, Email, Msg: "Register success" });
        })
        .catch((err) => {
          res.send({ Msg: err });
          console.error({ err });
        });
    } catch (err) {
      res.send({ Msg: err.message });
    }
  } else {
    res.send({ Msg: "Please provide All required Fields" });
  }
});
module.exports = router;
