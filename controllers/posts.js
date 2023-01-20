const { PostModel } = require("../models/post");
const { cloudinary } = require("../utils/cloudinary");
const Datauri = require("datauri/parser");
const path = require("path");

/**
 * @description This function converts the buffer to data url
 * @param {Object} req containing the field object
 * @returns {String} The dat url from the string buffer
 */
const parser = new Datauri();
const dataUri = (req) =>
  parser.format(
    path.extname(req.file.originalname).toString(),
    req.file.buffer
  );

const getPost = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    const { search, tags = [] } = req.query;
    let allposts = [];
    let totalDocs = 0;
    if (search || tags.length>0) {
      allposts = await PostModel.find({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { tags: { $in: [...tags] } },
        ],
      })
        .limit(limit)
        .skip(skip);
      totalDocs = await PostModel.find({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { tags: { $in: [...tags] } },
        ],
      }).count();
    } else {
      allposts = await PostModel.find().limit(limit).skip(skip);
      totalDocs = await PostModel.countDocuments();
    }
    res.status(200).json({ posts: allposts, totalDocs });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
const getMyPost = async (req, res) => {
  try {
    const creatorId = req.userId;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const totalDocs = await PostModel.countDocuments();
    const mypost = await PostModel.find({ creatorId }).limit(limit).skip(skip);
    res.status(200).json({ mypost, totalDocs });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const newPost = req.body;

    const file = dataUri(req).content;
    let result = await cloudinary.uploader.upload(file);

    const post = new PostModel({
      ...newPost,
      creatorMail: req.email,
      creatorId: req.userId,
      selectedFile: result.url,
    });
    await post.save();
    return res.status(201).json({ message: "Post created.", post });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const postUpdates = req.body;
    const postId = req.params.postId;
    const creatorId = req.userId;
    await PostModel.findOneAndUpdate(
      { $and: [{ _id: postId }, { creatorId }] },
      postUpdates
    );
    return res.status(201).json({ message: "Post updated." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const creatorId = req.userId;
    const deletedPost = await PostModel.findOneAndDelete({
      $and: [{ _id: postId }, { creatorId }],
    });
    return res.status(200).json({ message: "Post deleted." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

module.exports = { getPost, getMyPost, createPost, updatePost, deletePost };
