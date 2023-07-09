const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../db/UserSchema");
const jwt = require("jsonwebtoken");
const Const = require("../constant");

router.get("/api/users", (req, res) => {
  User.find()
    .select("-Password") //protecting password ensure  not showing in api
    .then((result) => {
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
  const { user } = req.params;
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
      res.send(result);
    })
    .catch((err) => res.send({ Msg: err }));
});

module.exports = router;
