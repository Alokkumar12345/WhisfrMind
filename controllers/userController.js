const JWT = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
var { expressjwt: jwt } = require("express-jwt");
//middleware for token
const requireSignIN = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});
//register
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //validation
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Name is required",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }
    if (!password || password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password is not valid.",
      });
    }
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "user already exist.",
      });
    }
    //hashed password
    const hashpassword = await hashPassword(password);
    //save user
    const user = await userModel({
      name,
      email,
      password: hashpassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "Registration Successful Please login.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in register API",
      error: error,
    });
  }
};
//login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "please provide email and password",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }
    if (!password || password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password is not valid.",
      });
    }

    const getUser = await userModel.findOne({ email: email });
    if (!getUser) {
      return res.status(500).send({
        success: false,
        message: "User not found please register",
      });
    }

    //match password//becrypt password
    const becryptpassword = await comparePassword(password, getUser.password);
    if (!becryptpassword) {
      return res.status(500).send({
        success: false,
        message: "Invalid username or password",
      });
    }
    //TOKEN JWT
    const token = await JWT.sign({ _id: getUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    //password unidefine
    getUser.password = "Undefined";
    res.status(200).send({
      success: true,
      message: "login successful",
      token,
      getUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in login",
      error: error,
    });
  }
};
//update-user controller
const updateController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //user find
    const user = await userModel.findOne({ email: email });
    // password verification
    if (!password || password.length < 6) {
      return res.status(500).send({
        success: false,
        message: "Password is not valid.",
      });
    }
    //incrypt password
    const hashUpdatePassword = password
      ? await hashPassword(password)
      : undefined;
    //update user
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashUpdatePassword || user.password,
      },
      { new: true }
    );
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "User updated successfully,Please login",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
  }
};
// forgot password
const ForgotPasswordController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found. Please register.",
      });
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update user's password
    const updatedPassword=await userModel.findOneAndUpdate({email},{
      password:hashedPassword ||user.password
    })
    

    res.status(200).send({
      success: true,
      message: "Password updated successfully. Please login.",
    });
  } catch (error) {
    console.error("ForgotPassword Error:", error);
    res.status(500).send({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
module.exports = {
  requireSignIN,
  registerController,
  loginController,
  updateController,
  ForgotPasswordController,
};
