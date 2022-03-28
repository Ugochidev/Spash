const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const reservationSchema = new Schema(
  {
    reservation: {
      type: String,
      enum: ["studioAppartment", "twobedAppartment", "other"],
      required: true,
    },
    time: {
      type: String,
      enum: ["morning", "afternoon", "evening"],
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
const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = Reservation;