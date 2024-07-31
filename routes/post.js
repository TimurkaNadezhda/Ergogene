const express = require("express");
const router = express.Router();
const Post = require('../models/Post');
const {
  displayCreatePostPage,
  createPost,
  displayPostsPage,
  displayPostUpdatePage,
  updatePost,
  displayPostDeletePage,
  deletePost,
} = require("../controllers/posts_controller");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { postCreateValidator } = require("../middlewares/validators/postCreateValidator");
const { postUpdateValidator } = require("../middlewares/validators/postUpdateValidator");

// Middleware, get post by ID and save it to request object or return error
const providePost = async (req, res, next) => {
  const post = await Post.findOne({ _id: req.params.id });

  if (post) {
      req.postDetails = post;
      next();
  } else {
      res.render(path.join(__dirname, '../views/error.ejs'));
  }
}

router.get("/posts/create", authMiddleware, displayCreatePostPage);
router.post("/posts/create", [authMiddleware, postCreateValidator], createPost);

router.get("/posts", authMiddleware, displayPostsPage);

router.get("/posts/:id/update", [authMiddleware, providePost], displayPostUpdatePage);
router.put("/posts/:id/update", [authMiddleware, postUpdateValidator], updatePost);

router.get("/posts/:id/delete", [authMiddleware, providePost], displayPostDeletePage);
router.delete("/posts/:id/delete", [authMiddleware, providePost], deletePost);

module.exports = router;
