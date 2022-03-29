//  require dependencies
const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth.middleware");
const {
  createAdmin,
  verifyEmail,
  loginAdmin,
  getAllUsers,
  countUsers,
} = require("../controllers/admin.controller");
//  creating a route
router.post("/createAdmin", createAdmin);
router.post("/verifyemail", verifyEmail);
router.post("/loginAdmin", loginAdmin);
router.get("/getAllUsers", authenticate, authorize, getAllUsers);
router.get("/countUsers", authenticate, authorize, countUsers);

//    exporting modules
module.exports = router;
