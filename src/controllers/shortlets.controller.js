const Shortlets = require("../models/shortlets.model");
const ApartmentPicture = require("../models/apartment.model");
const cloudinaryUploadMethod = require("../cloudinary");
const path = require("path");
const express = require("express");
const router = express.Router();
const upload = require("../multer");
const db = require("../DBconnect/connectPGsql");
const AppError = require("../utils/appError");
const { successResMsg, errorResMsg } = require("../utils/response");
const {validateshortlets} =require("../middleware/validiate.middleware")



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
    // validating reg.body with joi
 const validate = await validateshortlets.validateAsync(req.body);

//  Uploading  Shortlets
    const newShortlets = await db.query(
      "INSERT INTO Shortlets (apartmentName, state, numberOfRooms, address, amountPerNight, numberOfNights) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        apartmentName,
        state,
        numberOfRooms,
        address,
        amountPerNight,
        numberOfNights,
      ]
    );
    return successResMsg(res, 201, {
      message: "Shortlets  created",
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
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
    // pagination
    const allShortlets = await db.query(
      "SELECT * FROM Shortlets Order By id LIMIT 10 OFFSET (1 - 1) * 10"
    ); 
    const count = await db.query("SELECT COUNT(*)FROM shortlets");
    return successResMsg(res, 200, {
      message: "Shortlets fetch successfully",
      count,
      allShortlets,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};

//   Fetch number of all available shortlets
const countShortlets = async (req, res, next) => {
  try {
    const numberShortlets = await db.query("SELECT COUNT(*)FROM shortlets");
    return successResMsg(res, 200, {
      message: "number of all available shortlets",
      numberShortlets,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};

//  fetch apartment by State

const fetchApartment = async (req, res, next) => {
  try {
    const { state } = req.headers;
    const apartmentByState = await db.query(
      "SELECT state , COUNT(*)FROM shortlets GROUP BY state HAVING (COUNT(*) > 1);"
    );
    return successResMsg(res, 200, {
      message: "fetched apartment by State sucessfully",
      apartmentByState,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};
//  Uploading image with clou
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
