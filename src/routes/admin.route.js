//  require dependencies
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth.middleware");
const {
  createAdmin,
  verifyEmailAddress,
  loginAdmin,
  forgetPasswordLinkAdmin,
  forgetPassword,
  updatePassword,
} = require("../controllers/admin.controller");
//  creating  route
router.post("/admin", createAdmin);
router.post("/verifyemail/admin", verifyEmailAddress);
router.post("/login/admin", loginAdmin);
router.post("/forgetPasswordLink/admin", forgetPasswordLinkAdmin);
router.post("/forgetPassword/admin", forgetPassword);
router.post("/updatePassword/admin", authenticate, updatePassword);

//    exporting modules
module.exports = router;
