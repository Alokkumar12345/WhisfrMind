const express = require("express");
const { route } = require("./userRoutes");
const { requireSignIN } = require("../controllers/userController");
const {
  getAllPostsController,
  createPostControllers,
  getUserPostController,
  deletePostController,
  updatePostController,
} = require("../controllers/postController");

//router object
const router = express.Router();
//Create post || post
router.post("/create-post", requireSignIN, createPostControllers);
//Get all post
router.get("/get-all-post", getAllPostsController);
//Get User post
router.get("/get-user-post", requireSignIN, getUserPostController);
//Delete post
router.delete("/delete-post/:id", requireSignIN, deletePostController);
//Update post
router.put("/update-post/:id",requireSignIN,updatePostController)

//export
module.exports = router;
