/*
 This is the assigmnent to create api for login ,register, forgot password

 this file init the server or include all routers

*/
const express = require("express");
const app = express();
const Const = require("./constant");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require("dotenv").config();
app.use(cookieParser());
app.use(
  session({
    secret: Const.secret,
    resave: true, // Add this line to explicitly set the resave option
    saveUninitialized: true,
  })
);

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "./public")));
app.use(require("./api/register"));
app.use(require("./api/login"));
app.use(require("./api/forgot-pssword"));
app.use(require("./api/api"));
app.use(require("./api/posts"));
const conn = require("./db/conn");
require("dotenv").config();
const PORT = process.env.PORT || Const.port;

app.listen(PORT, (req, res) => {
  console.log("Server Listen ON PORT:", PORT);
  conn();
});

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("pages/index");
});

// urls

app.get("/login/", (req, res) => {
  res.render("pages/login");
});

app.get("/task1/", (req, res) => {
  res.render("pages/task1");
});

app.get("/home/", async (req, res) => {
  const { user = { session: false } } = req.session;
  if (!user.session) {
    res.redirect("/login");
    return;
  }

  const Post = require("./db/PostSchema");
  try {
    const posts = await Post.find();
    const myposts = await Post.find({ userId: user._id });

    res.render("pages/home", { user, posts, myposts });
  } catch (error) {
    // Handle the error
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.sendStatus(500);
    } else {
      res.redirect("/login");
    }
  });
});
