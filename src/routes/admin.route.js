//  require dependencies
const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth.middleware");
const {
  createAdmin,
  loginAdmin
} = require("../controllers/admin.controller");
//  creating a route
router.post("/createAdmin", createAdmin);
router.post("/loginAdmin", loginAdmin);

//    exporting modules
module.exports = router;
