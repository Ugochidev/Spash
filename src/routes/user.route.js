//  require dependencies
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth.middleware");
const {
  createUser,
  verifyEmail,
  loginUser,
  forgetPasswordLink,
  changePassword,
  resetPassword,
} = require("../controllers/user.controller");
//  creating a route
router.post("/createUser", createUser);
router.post("/verifyemail", verifyEmail);
router.post("/loginUser", loginUser);
router.post("/forgetPasswordLink", forgetPasswordLink);
router.post("/ forgetPassword", changePassword);
router.post("/resetPassword", resetPassword);
//    exporting modules
module.exports = router;
