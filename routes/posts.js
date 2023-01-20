const { Router } = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single("image");
// const dUri = new Datauri();


const {
  getPost,
  createPost,
  getMyPost,
  updatePost,
  deletePost,
} = require("../controllers/posts");

const postRouter = Router();

postRouter.get("/all", getPost);
postRouter.get("/myposts", getMyPost);
postRouter.post("/new", multerUploads, createPost);
postRouter.patch("/update/:postId", updatePost);
postRouter.delete("/delete/:postId", deletePost);

module.exports = { postRouter };
