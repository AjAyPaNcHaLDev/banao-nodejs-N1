const express = require("express");
const router = express.Router();
const User = require("../db/UserSchema");
// api for forgot-password.
router.get("/api/forgot-password", (req, res) => {
  const { Username = "", Email = "" } = req.query;
  if (Username != "" || Email != "") {
    User.findOne({ $or: [{ Username }, { Email }] }).then((result) => {
      if (result == null) {
        res.send({ Msg: "User Not Found" });
        return;
      }

      res.send({
        Msg: `Hi! ${result.Name} We are sending your password to your registerd Email ${result.Email} please check it.`,
        Name: result.Name,
        Username: result.Username,
        Email: result.Email,
        Note: ` Note: Password to user email are not send it just a demo how forgot password work `,
        EmailHtml: `hi!,<b>${result.Name}</b><br> <h4>Username:${result.Username} <h4><br><h4>Password: ${result.Password}</h4> Please Do Not share your pasword to anyone Thank You...`,
      });
    });
  } else {
    res.send({ Msg: "Please provide Username or Email" });
  }
});
module.exports = router;
