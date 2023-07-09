const mongoose = require("mongoose");

// Define the Post schema
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  Username: { type: String, default: null },
  likes: [
    {
      isLike: Boolean,
      author: String,
    },
  ],
  comments: [
    {
      text: String,
      author: String,
    },
  ],
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
