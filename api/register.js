const express = require("express");
const router = express.Router();

const User = require("../db/UserSchema");

/* In This file this pont has been cover while register new User.

Check Empty field if any filed empty its reject the user registration.
Check Already registred email or username if already registred then reject the user registration.
AtLast all check it register the user.

*/

// api for register.
router.get("/api/register", async (req, res) => {
  const { Name = "", Username = "", Email = "", Password = "" } = req.query;
  if (Username != "" || Email != "" || Name !== "" || Password !== "") {
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
          const { Username, Email, Name } = result;
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
