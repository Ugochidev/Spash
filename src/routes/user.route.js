//  require dependencies
const express = require("express");
const router = express.Router();
const {
  createUser,
  verifyEmail,
  loginUser,
  forgetPasswordLink,
} = require("../controllers/user.controller");

//  creating route
router.post("/createUser", createUser);
router.post("/loginUser", loginUser);
router.post("/verifyEmail", verifyEmail);
router.post("/forgetPasswordLink", forgetPasswordLink);


//    exporting modules
module.exports = router;
