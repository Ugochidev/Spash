const Booking = require("../models/booking.model");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const db = require("../DBconnect/connectPGsql");
const { successResMsg, errorResMsg } = require("../utils/response");
const { validatebooking } = require("../middleware/validiate.middleware");

// booking a shortlet
const bookShortlets = async (req, res, next) => {
  try {
    const {
      reservation,
      time,
      TotalAmount,
      amountPerDay,
      noOfNights,
      date,
      noOfRooms,
      shortlets_id,
      userEmail,
    } = req.body;
    // validating reg.body with joi
    await validatebooking.validateAsync(req.body);

    let totalAmount = (noOfRooms * noOfNights) * amountPerDay;
    console.log(totalAmount)
    // booking
    const newbooking = await db.query(
      "INSERT INTO Booking (reservation, time, amountPerDay, noOfNights,noOfRooms,totalAmount, date, shortlets_id, userEmail) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        reservation,
        time,
        amountPerDay,
        noOfNights,
        noOfRooms,
        totalAmount,
        date,
        shortlets_id,
        userEmail,
      ]
    );
    return successResMsg(res, 201, {
      message: "Shortlets booked",
      newbooking: newbooking.rows[0],
    });
  } catch (error) {
    console.log(error)
    return errorResMsg(res, 500, { message: error });
  }
};

//  booking payment with paystack

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
      bookings: booking.rows,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};
//   making payment using paystack
const paymentVerification = async (req, res, next) => {
  try {
    const { reference } = req.query;
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
module.exports = {
  bookShortlets,
  bookingPayment,
  paymentVerification,
};
