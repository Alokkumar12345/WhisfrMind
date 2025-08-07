const express = require("express");
const {
  registerController,
  loginController,
  updateController,
  requireSignIN,
  ForgotPasswordController,
} = require("../controllers/userController");
const router = express.Router();

//routes || post
router.post("/register", registerController);
//login || post
router.post("/login", loginController);
//update || post
router.put("/update-user",requireSignIN,updateController)
//forgot Password
router.put("/update-password",ForgotPasswordController)


module.exports = router;
