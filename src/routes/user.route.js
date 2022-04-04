//  require dependencies
const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
} = require("../controllers/user.controller");

//  creating route
router.post("/createUser", createUser);
router.post("/loginUser", loginUser);


//    exporting modules
module.exports = router;
