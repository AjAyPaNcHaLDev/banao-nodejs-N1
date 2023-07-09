const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  Name: { type: String },
  Username: { type: String, required: true },
  Email: { type: String, required: true },
  Password: { type: String, required: true },
});

const User = mongoose.model("User", Schema);
module.exports = User;
