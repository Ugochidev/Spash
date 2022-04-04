const Booking = require("../models/booking.model");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const db = require("../DBconnect/connectPGsql");
const { successResMsg, errorResMsg } = require("../utils/response");
const  {validatebooking} = require("../middleware/validiate.middleware")


const bookShortlets = async (req, res, next) => {
  try {
    const {
      reservation,
      time,
      TotalAmount,
      amountPerDay,
      noOfNights,
      date,
      id,
    } = req.body; 
    // validating reg.body with joi
const validate = await  validatebooking.validateAsync(req.body); 

    let totalAmount = noOfNights * amountPerDay;
    // booking
    const newbooking = await db.query(
      "INSERT INTO Booking (reservation, time, amountPerDay, noOfNights,totalAmount, date) VALUES ($1, $2, $3, $4, $5, $6)",
      [reservation, time, amountPerDay, noOfNights, totalAmount, date]
    );
    return successResMsg(res, 201, {
      message: "Shortlets",
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};
const bookingPayment = async (req, res, next) => {
  try {
    const { id } = req.headers;
    const booking = await db.query("SELECT id FROM booking");
    const data = await axios({
      url: "https://api.paystack.co/transaction/initialize",
      method: "post",
      headers: {
        Authorization: `Bearer ${process.env.paystack_Secret}`,
      },
      data: {
        email: "ugochukwuchioma16@gmail.com",
        amount: "8000000",
      },
    });
    return res.status(200).json({
      data: data.data.data,
      bookings: booking,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};

const paymentVerification = async (req, res, next) => {
  try {
    const { reference } = req.headers;
    const data = await axios({
      url: `https://api.paystack.co/transaction/verify/${reference}`,
      method: "get",
      headers: {
        Authorization: `Bearer ${process.env.paystack_Secret}`,
      },
      data: {
        email: "ugochukwuchioma16@gmail.com",
        amount: "8000000",
      },
    });
    return res.status(200).json({
      data: data.data.data.gateway_response,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};
module.exports = { bookShortlets, bookingPayment, paymentVerification };
