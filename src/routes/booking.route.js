const express = require("express");
const router = express.Router();
const {
  bookShortlets,
  bookingPayment,
  paymentVerification,
} = require("../controllers/booking.controller");
const { authenticate} = require("../middleware/auth.middleware");
//  creating route
router.post("/bookShortlets", authenticate, bookShortlets);
router.post("/bookingPayment",authenticate, bookingPayment);
router.get("/paymentVerification",authenticate, paymentVerification);

module.exports = router;