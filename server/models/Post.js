const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema(
  {
    title: { type: String },
    summary: { type: String },
    content: { type: String },
    cover: { type: String }, // this is the image that we uploaded
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const PostModal = mongoose.model("Post", PostSchema);
module.exports = PostModal;
