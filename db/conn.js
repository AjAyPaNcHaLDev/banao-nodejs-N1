const mongoose = require("mongoose");
const Const = require("../constant");
const Url = process.env.mongooseUrl || Const.mongooseUrl;
const conn = async () => {
  await mongoose
    .connect(Url)
    .then(() => {
      console.log("Connected MongoDB");
    })
    .catch((err) => console.log(err));
};

module.exports = conn;
