const express = require("express");
const router = express.Router();
const {
  bookShortlets,
  bookingPayment,
  paymentVerification,
} = require("../controllers/booking.controller");
const { authenticate } = require("../middleware/auth.middleware");
//  creating route
router.post("/book-shortlets", authenticate, bookShortlets);
router.post("/payment", authenticate, bookingPayment);
router.get("/verify-payment", authenticate, paymentVerification);

module.exports = router;
