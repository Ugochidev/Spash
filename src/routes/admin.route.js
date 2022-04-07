//  require dependencies
const express = require("express");
const router = express.Router();
const { authenticate} = require("../middleware/auth.middleware");
const {
  createAdmin,
  verifyEmailAddress,
  loginAdmin,
  forgetPasswordLinkAdmin,
  forgetPassword,
  updatePassword,
} = require("../controllers/admin.controller");
//  creating  route
router.post("/createAdmin", createAdmin);
router.post("/verifyEmailAddress", verifyEmailAddress);
router.post("/loginAdmin", loginAdmin);
router.post("/forgetPasswordLinkAdmin", forgetPasswordLinkAdmin);
router.post("/forgetPassword", forgetPassword);
router.post("/updatePassword", authenticate, updatePassword);

//    exporting modules
module.exports = router;
