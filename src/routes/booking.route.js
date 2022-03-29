const express = require("express");
const router = express.Router();
const { bookShortlets, bookingPayment, paymentVerification} = ("../controllers/booking.controller");

router.post("/bookShortlets", bookShortlets);
router.post("/bookingPayment", bookingPayment);
router.get("/paymentVerification", paymentVerification);