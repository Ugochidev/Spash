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

//   fetch all available shortlets
const  fetchAllShortlets = async (req, res, next) => {
  try {
    const fetchShortlets = await Shortlets.find();
    return successResMsg(res, 200, {
      message: "fetch all available shortlets sucessfully",
      fetchShortlets,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};


//   Fetch number of all available shortlets
const countShortlets = async (req, res, next) => {
  try {
    const numberShortlets = await Shortlets.countDocuments();
    return successResMsg(res, 200, {
      message: "number of all available shortlets"
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};

//  fetch apartment by State

const fetchApartment = async (req, res, next) => {
  try {
    const { state } = req.headers;
    const apartmentByState = await User.find({ state }).select(
      "apartmentName"
    );
    return successResMsg(res, 200, {
      message: "fetched apartment by State sucessfully",
      apartmentByState,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
}; 


module.exports = { uploadShortlets, fetchAllShortlets, countShortlets };
