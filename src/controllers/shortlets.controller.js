const Shortlets = require("../models/shortlets.model");

const uploadShortlets = async (req, res, next) => {
  try {
    const {
      apartmentName,
      state,
      numberOfRooms,
      address,
      amountPerNight,
      numberOfNights,
    } = req.body;
    if (
      (!apartmentName || !state || !numberOfRooms || !address,
      !amountPerNight || !numberOfNights)
    )
      return res.status(400).json({
        message: "please fill the required fields",
      });
    const shortlets = await Shortlets.create({
      apartmentName,
      state,
      numberOfRooms,
      address,
      amountPerNight,
      numberOfNights,
    });
    return res.status(201).json({
      shortlets,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = { uploadShortlets};
