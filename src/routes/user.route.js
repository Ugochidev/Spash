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
const keycloak = require("../utils/keycloak").getKeycloak();
app.use(keycloak.middleware());

//  creating route
router.post("/user", createUser);
router.post("/user", verifyEmail);
router.post("/user", loginUser);
router.post("/user", forgetPasswordLink);
router.post("/user", changePassword);
router.post("/user", authenticate, resetPassword);

//    exporting modules
module.exports = router;
