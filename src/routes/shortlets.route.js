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
const upload = require("../multer");
//  creating  route
router.post(
  "/shortlets",
  authenticate,
  authorize,
  upload.array("pictures", 24),
  uploadShortlets
);
router.get("/shortlets", fetchAllShortlets);
router.get("/shortlets", countShortlets);
router.get("/apartment", fetchApartment);
//    exporting modules
module.exports = router;
