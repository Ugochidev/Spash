const Shortlets = require("../models/shortlets.model");
const ApartmentPicture = require("../models/apartment.model");
const cloudinaryUploadMethod = require("../cloudinary");
const path = require("path");
const express = require("express");
const router = express.Router();
const upload = require("../multer");

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
};

//   fetch all available shortlets

const fetchAllShortlets = async (req, res, next) => {
  try {
    const { page, limit } = req.headers;
    if (limit === null || page === null) {
      limit = 10;
      page = 1;
    }
    const allShortlets = await Shortlets.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ apartmentName: -1 })
      .exec();
    const count = await Shortlets.countDocuments();
    return successResMsg(res, 200, {
      message: "Shortlets fetch successfully",
      allShortlets,
      total: allShortlets.length,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
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
      message: "number of all available shortlets",
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};

//  fetch apartment by State

const fetchApartment = async (req, res, next) => {
  try {
    const { state } = req.headers;
    const apartmentByState = await User.find({ state });
    return successResMsg(res, 200, {
      message: "fetched apartment by State sucessfully",
      apartmentByState,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};

router.post("/image", upload.array("pictures", 24), async (req, res) => {
  try {
    let pictureFiles = req.files;

    const urls = [];
    const files = req.files;
    if (!files)
      return res.status(400).json({ message: "No picture attached!" });
    for (const file of files) {
      const { path } = file;
      const newPath = await cloudinaryUploadMethod(path);
      console.log(newPath);
      urls.push(newPath);
    }
    images = urls.map((url) => url.res);
    const newHousePics = new ApartmentPicture({
      imageResponses: images,
    });
    res.status(200).json({
      imageResponses: images,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = {
  uploadShortlets,
  fetchAllShortlets,
  countShortlets,
  fetchApartment,
  router,
};
