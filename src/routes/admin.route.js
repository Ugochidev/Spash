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
router.post("/admin", createAdmin);
router.post("/admin", verifyEmailAddress);
router.post("/admin", loginAdmin);
router.post("/admin", forgetPasswordLinkAdmin);
router.post("/admin", forgetPassword);
router.post("/admin", authenticate, updatePassword);

//    exporting modules
module.exports = router;
