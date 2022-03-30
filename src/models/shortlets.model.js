const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const shortletsSchema = new Schema(
  {
    apartmentName: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    numberOfRooms: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    amountPerNight: {
      type: String,
      required: true,
      trim: true,
    },
    numberOfNights: {
      type: String,
      required: true,
      trim: true,
    },
    // image: {
    //   type: [String],
    //   required: true,
    //   trim: true,
    // },
  },
  {
    timestamps: true,
  }
);

const Shortlets = mongoose.model("Shortlets", shortletsSchema);

module.exports = Shortlets;
