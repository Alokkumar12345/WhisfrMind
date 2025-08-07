const postModel = require("../models/postModel");

const createPostControllers = async (req, res) => {
  try {
    const { title, description } = req.body;
    //validation
    if (!title || !description) {
      res.status(400).send({
        success: true,
        message: "please provide all fields.",
      });
    }
    const post = await postModel({
      title,
      description,
      postedBy: req.auth._id,
    }).save();
    res.status(201).send({
      success: true,
      message: "Post craeted successfully.",
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Create Post API",
    });
  }
};
const getAllPostsController = async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate("postedBy", "_id name")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "All posts fetched successfully.",
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in geting all posts.",
    });
  }
};
const getUserPostController = async (req, res) => {
  try {
    const userPosts = await postModel.find({ postedBy: req.auth._id });
    res.status(200).send({
      success: true,
      message: "user posts",
      userPosts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting user posts",
      error,
    });
  }
};
//deletePost controller

const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;
    await postModel.findByIdAndDelete({ _id: id });
    res.status(200).send({
      success: true,
      message: "Your posts has been deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting the posts.",
      error,
    });
  }
};
//updatepostcontroller
const updatePostController = async (req, res) => {
  try {
    const { title, description } = req.body;
    const post = await postModel.findById({ _id: req.params.id });
    //validation
    if (!title || !description) {
      res.status(500).send({
        success: false,
        message: "please add title or description.",
      });
    }
    const updatePost = await postModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        title: title || post.title,
        description: description || post.description,
      },
      { new: true }
    ); 
    res.status(200).send({
      success:true,
      message:"Post updated successfully",
      updatePost
    })
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createPostControllers,
  getAllPostsController,
  getUserPostController,
  deletePostController,
  updatePostController
};
