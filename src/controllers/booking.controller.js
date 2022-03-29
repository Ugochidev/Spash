const Booking = require("../models/booking.model");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const bookShortlets = async (req, res, next) => {
  try {
    const { reservation, time, totalAmount, amountPerDay, noOfDays, date } =
      req.body;
    if (
      !reservation ||
      !time ||
      !totalAmount ||
      !amountPerDay ||
      !noOfDays ||
      !date
    )
      return res.status(400).json({
        message: "please fill the required fields",
      });

    const bookings = new Booking({
      reservation,
      time,
      totalAmount,
      amountPerDay,
      noOfDays,
      date,
    });
    return res.status(201).json({
      bookings,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const bookingPayment = async (req, res, next) => {
  try {
    const data = await axios({
      url: "https://api.paystack.co/transaction/initialize",
      method: "post",
      headers: {
        Authorization: `Bearer ${process.env.paystack-Secret}`,
      },
      data: {
        email: "ugochukwuchioma16@gmail.com",
        amount: "80000000",
      },
    });
    return res.status(200).json({
      data: data.data.data,
    });
  } catch (error) {
    message: error.message;
  }
};

const paymentVerification = async (req, res, next) => {
  try {
    const { reference } = req.headers;
    const data = await axios({
      url: `https://api.paystack.co/transaction/verify/${reference}`,
      method: "get",
      headers: {
        Authorization: `Bearer ${process.env.paystack-Secret}`,
      },
      data: {
        email: "ugochukwuchioma16@gmail.com",
        amount: "80000000",
      },
    });
    console.log(data);
    return res.status(200).json({
      data: data.data.data.gateway_response,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};
module.exports = { bookShortlets, bookingPayment, paymentVerification };