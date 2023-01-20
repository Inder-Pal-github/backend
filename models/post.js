const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  selectedFile: { type: String, required: true },
  creatorId: { type: String, required: true },
  creatorMail: { type: String, required: true },
  tags: { type: [String], required: true },
  likes: { type: [String], default: [] },
  comments: { type: [String], default: [] },
  createdAt: { type: Date, default: new Date() },
});

const PostModel = mongoose.model("post", PostSchema);
module.exports = { PostModel };
