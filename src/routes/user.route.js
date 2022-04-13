//  require dependencies
const express = require("express");
const app = express();
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
// const keycloak = require("../utils/keycloak").getKeycloak();
// app.use(keycloak.middleware());

//  creating route
router.post("/user", createUser);
router.post("/auth/verify-email/user", verifyEmail);
router.post("/auth/login/user", loginUser);
router.post("/auth/forgetPasswordLink/user", forgetPasswordLink);
router.post("/auth/forgetpassword/user", changePassword);
router.post("/auth/updatepassword/user", authenticate, resetPassword);

//    exporting modules
module.exports = router;
