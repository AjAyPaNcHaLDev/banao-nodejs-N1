const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../db/UserSchema");
const Post = require("../db//PostSchema");
const jwt = require("jsonwebtoken");
const Const = require("../constant");

// this is the middleware apply to check jwt token is valid or not
const middleware = async (req, res, next) => {
  const { token } = req.body;
  try {
    data = jwt.verify(token, Const.jwtKey);
    if (!data) {
      res.send({ Msg: "Your token is invalid Please try relogin." });
      return;
    }
  } catch (e) {
    res.send({ Msg: e.message });
    return;
  }
  next();
};

router.post("/posts/new", middleware, async (req, res) => {
  try {
    const { title, content, token = "" } = req.body;
    const { user = { session: false } } = req.session;

    let { _id = "", Username } = jwt.verify(token, Const.jwtKey);
    const userId = _id || req.session.user._id;
    Username = Username || req.session.user.Username;
    newPost = new Post({ title, content, userId, Username });
    await newPost.save();
    res.send({ Msg: "Your Post is Posted" });
    return;
  } catch (err) {
    res.send({ Msg: err.message });
    return;
  }
});

router.post("/posts/update", middleware, async (req, res) => {
  try {
    const { title, content, updateId, token = "" } = req.body;

    let { _id = "", Username } = jwt.verify(token, Const.jwtKey);

    try {
      const post = await Post.findById(updateId);

      if (!post) {
        // If the post is not found, handle the error
        return res.status(404).send({ Msg: "Your Post Not Found" });
      }
      if (_id !== post.userId) {
        return res
          .status(200)
          .send({ Msg: "Your Can not update this post without valid token " });
      }
      // Update the post with the new data
      post.title = title;
      post.content = content;

      // Save the updated post
      await post.save();

      res.send({ Msg: "Your Post is Updated" });
    } catch (err) {
      res.send({ Msg: err.message });
    }

    return;
  } catch (err) {
    res.send({ Msg: err.message });
    return;
  }
});

router.post("/posts/delete/:id", middleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ Msg: "Post not found" });
    }

    res.status(200).json({ Msg: "Post deleted successfully", deletedPost });
  } catch (error) {
    res.status(500).json({ Msg: "An error occurred" });
  }
});

router.get("/api/posts/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.send(posts);
    return;
  } catch (err) {
    res.send({ Msg: err.message });
    return;
  }
});

// Route to add a comment to a post
router.post("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;
  const author = req.session.user.Username;
  try {
    // Find the post by ID and update the comments array
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { text, author } },
      },
      { new: true }
    );

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ Msg: "Server error" });
  }
});

router.post("/posts/:postId/likes", middleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { Username = "" } = req.session.user;
    const author = Username;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ Msg: "Post not found" });
    }

    const existingLikeIndex = post.likes.findIndex(
      (like) => like.author === author
    );

    if (existingLikeIndex !== -1) {
      post.likes.splice(existingLikeIndex, 1);
      const updatedPost = await post.save();
      res.status(200).json({ Msg: "You Unlike A Post", post: updatedPost });
    } else {
      post.likes.push({ isLike: true, author });
      const updatedPost = await post.save();
      return res.status(200).json({ Msg: "You Like A Post", updatedPost });
    }
  } catch (err) {
    res.send({ Msg: err.message });
  }
});

router.post("/posts/:postId/likes/:likeId", middleware, async (req, res) => {
  const { postId, likeId } = req.params;
  const { isLike, author } = req.body;

  try {
    const post = await Post.findOneAndUpdate(
      { _id: postId, "likes._id": likeId },
      { $set: { "likes.$.isLike": isLike, "likes.$.author": author } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ Msg: "Post or like not found" });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ Msg: "Server error" });
  }
});

module.exports = router;
