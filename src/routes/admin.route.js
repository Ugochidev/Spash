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
router.post("/auth/verify-email", verifyEmailAddress);
router.post("/auth/login", loginAdmin);
router.post("/auth/forgetPasswordLink", forgetPasswordLinkAdmin);
router.patch("/auth/forgetPassword", forgetPassword);
router.patch("auth/updatePassword", authenticate, updatePassword);

//    exporting modules
module.exports = router;
