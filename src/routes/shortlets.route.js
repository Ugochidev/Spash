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
  "/uploadShortlets",
  authenticate,
  authorize,
  upload.array("pictures", 24),
  uploadShortlets
);
router.get("/fetchAllShortlets", fetchAllShortlets);
router.get("/countShortlets", countShortlets);
router.get("/fetchApartment", fetchApartment);
//    exporting modules
module.exports = router;
