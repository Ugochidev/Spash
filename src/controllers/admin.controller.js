//  Require dependencies

const Admin = require("../models/admin.model");
const { successResMsg, errorResMsg } = require("../utils/response");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { sendMail } = require("../utils/sendMail");
const {
  validateRegister,
  validateLogin,
} = require("../middleware/validiate.middleware");
const db = require("../DBconnect/connectPGsql");

//  creating  Admin
const createAdmin = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber, email, password } = req.body;

    const result = await validateRegister.validateAsync(req.body);

    const hashPassword = await bcrypt.hash(password, 10);

    const newAdmin = await db.query(
      "INSERT INTO admin (firstName, lastName, phoneNumber, email, password) VALUES ($1, $2, $3, $4, $5)",
      [firstName, lastName, phoneNumber, email, hashPassword]
    );
    const data = {
      id: newAdmin.id,
      email: newAdmin.email,
      role: newAdmin.role,
    };
    const url = "theolamideolanrewaju.com";
    const token = await jwt.sign(data, process.env.SECRET_TOKEN, {
      expiresIn: "2h",
    });
    let mailOptions = {
      to: newAdmin.email,
      subject: "Verify Email",
      text: `Hi ${firstName}, Pls verify your email. ${url}
       ${token}`,
    };
    await sendMail(mailOptions);
    return successResMsg(res, 201, {
      message: "Admin  created",
      newAdmin,
      token,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};

//  login for Admin
const loginAdmin = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;
    const login = await validateLogin.validateAsync(req.body);

    const phoneNumberExist = await db.query(
      "SELECT * FROM admin WHERE admin.phoneNumber = phoneNumber"
    );
    if (!phoneNumberExist) {
      return next(
        new AppError("PhoneNumber does not exist please sign-up", 400)
      );
    }
     console.log("you");
    const isPasswordExist = await bcrypt.compare(
      password =
      phoneNumberExist.password
    );
    if (!isPasswordExist) {
      return next(new AppError(" Invalid Password", 400));
    }
   
    if (!emailExist.role == "Admin") {
      return next(new AppError("Unauthorized", 401));
    }
    if (!emailExist.isVerified) {
      return res.status(401).json({ message: "Admin not verified" });
    }
    const data = {
      id: phoneNumberExist._id,
      phoneNumber: phoneNumberExist.phoneNumber,
      role: phoneNumberExist.role,
    };

    const token = await jwt.sign(data, process.env.SECRET_TOKEN, {
      expiresIn: "1h",
    });
    return successResMsg(res, 200, {
      message: "Admin logged in sucessfully",
      token,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};

//  exporting module
module.exports = {
  createAdmin,
  loginAdmin,
};
