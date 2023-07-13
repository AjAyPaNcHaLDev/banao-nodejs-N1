const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../db/UserSchema");
const jwt = require("jsonwebtoken");
const Const = require("../constant");
const encrypte = require("../encrypte");
router.get("/api/users", (req, res) => {
  User.find()
    .select("-Password") //protecting password ensure  not showing in api
    .then((result) => {
      if (!result) {
        res.send([]);
        return;
      }
      result = result.map((user) => {
        let { Name, Username, Email, _id } = user;

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

        return { Name, Username, Email, _id };
      });
      res.send(result);
    })
    .catch((err) => res.send({ Msg: err }));
});
router.get("/api/users/encrypte", (req, res) => {
  User.find()
    .select("-Password") //protecting password ensure  not showing in api
    .then((result) => {
      if (!result) {
        res.send([]);
        return;
      }

      res.send(result);
    })
    .catch((err) => res.send({ Msg: err }));
});

router.get("/token/:token", (req, res) => {
  const { token } = req.params;
  try {
    data = jwt.verify(token, Const.jwtKey);
    res.send({ Msg: "This is the user Data currenlty logined ", data });
  } catch (err) {
    res.send({ Msg: "Please provide a valid token ", error: err.message });
  }
});

router.get("/api/users/:user", (req, res) => {
  let { user } = req.params;

  user = encrypte.encryptData(
    user,
    Const.encryptionKey,
    encrypte.initializationVector
  );

  User.findOne({
    $or: [
      { Email: user },
      { Username: user },
      { _id: mongoose.Types.ObjectId.isValid(user) ? user : null },
    ],
  })
    .select("-Password") //protecting password ensure  not showing in api
    .then((result) => {
      if (result == null) {
        res.send({ Msg: "Please Provide Valid any from Email,Username or id" });
        return;
      }

      let { Username, Email, Name, _id } = result;
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
      res.send({ Username, Email, Name, _id });
    })
    .catch((err) => res.send({ Msg: err }));
});

module.exports = router;
