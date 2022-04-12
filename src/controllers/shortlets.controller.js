const Shortlets = require("../models/shortlets.model");
const cloudinaryUploadMethod = require("../cloudinary");
const path = require("path");
const express = require("express");
const router = express.Router();
const upload = require("../multer");
const db = require("../DBconnect/connectPGsql");
const AppError = require("../utils/appError");
const { successResMsg, errorResMsg } = require("../utils/response");
const { validateshortlets } = require("../middleware/validiate.middleware");

// Uploading shortlets
const uploadShortlets = async (req, res, next) => {
  try {
    const urls = [];
    const files = req.files;
    if (!files) return next(new AppError("No picture attached..", 400));
    for (const file of files) {
      const { path } = file;
      const newPath = await cloudinaryUploadMethod(path);

      urls.push(newPath);
    }
    images = urls.map((url) => url.res);

    const { apartmentName, state, numberOfRooms, address, amountPerNight } =
      req.body;
    // validating reg.body with joi
    await validateshortlets.validateAsync(req.body);
    pictures = images;
    const data = await db.query(
      "INSERT INTO Shortlets (apartmentName, state, numberOfRooms, address, amountPerNight,  pictures) VALUES ($1, $2, $3, $4, $5, $6)",
      [apartmentName, state.toLowerCase(), numberOfRooms, address, amountPerNight, images]
    );
    return successResMsg(res, 201, {
      message: "Shortlets  created",
      images: images,
      data: data,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};

//   fetch all available shortlets

const fetchAllShortlets = async (req, res, next) => {
  try { 
    const {page} = req.query
    // pagination
    const allShortlets = await db.query(
      `SELECT * FROM Shortlets Order By id LIMIT 10 OFFSET ${(page - 1) * 10}`
    );
    if(
      allShortlets.rows[0]== null ||
      !allShortlets.rows[0] ||
      allShortlets.rows[0]== []
    ){
      returnres.status(404).json({
        message:"page not found"
      })
    }
    const count = await db.query("SELECT COUNT(*)FROM shortlets");
    return successResMsg(res, 200, {
      message: "Shortlets fetch successfully",
      count: count.rows[0],
      allShortlets: allShortlets.rows,
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
      numberOfShortlets: numberShortlets.rows[0],
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};

//  fetch apartment by State
const fetchApartment = async (req, res, next) => {
  try {
    const { state } = req.query;
    
    const apartmentByState = await db.query(
      "SELECT * FROM shortlets WHERE state = $1",
      [state]
    );
    return successResMsg(res, 200, {
      message: "fetched apartment by State sucessfully",
      apartmentByState: apartmentByState.rows,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};

module.exports = {
  uploadShortlets,
  fetchAllShortlets,
  countShortlets,
  fetchApartment,
};
