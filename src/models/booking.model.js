const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const bookingSchema = new Schema(
  {
    reservation: {
      type: String,
      enum: ["studioAppartment", "twobedAppartment", "others"],
      required: true,
    },
    time: {
      type: String,
      enum: ["morning", "afternoon", "evening"],
      required: true,
    },
    noOfDays: {
      type: Number,
      required: true,
    },
    amountPerDay: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// converting schemas into a model
const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;