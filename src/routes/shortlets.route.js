//  require dependencies
const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth.middleware");
const {
 uploadShortlets,
  fetchAllShortlets,
  countShortlets,
  fetchApartment,
} = require("../controllers/shortlets.controller");
//  creating a route
router.post("/ uploadShortlets", authenticate, authorize, uploadShortlets);
router.get("/fetchAllShortlets", fetchAllShortlets);
router.get("/countShortlets", countShortlets);
router.get("/fetchApartment", fetchApartment);
//    exporting modules
module.exports = router;
