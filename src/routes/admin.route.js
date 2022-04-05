//  require dependencies
const express = require("express");
const router = express.Router();
const { createAdmin, loginAdmin } = require("../controllers/admin.controller");
//  creating  route
router.post("/createAdmin", createAdmin);
router.post("/loginAdmin", loginAdmin);

//    exporting modules
module.exports = router;
