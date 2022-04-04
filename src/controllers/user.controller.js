//  Require dependencies
const User = require("../models/user.model");
const { successResMsg, errorResMsg } = require("../utils/response");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { sendMail } = require("../utils/sendMail");
const {
  validiateUser,
  UserLogin,
} = require("../middleware/validiate.middleware");
const db = require("../DBconnect/connectMysql");

//  creating  a user
const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber, email, password } = req.body;
    // validating reg.body with joi
    const registerUser = await validiateUser.validateAsync(req.body);
const [row]
    //  hashing password
    const hashPassword = await bcrypt.hash(password, 10);

    // creating a new user
    const [newUser] = await db.execute(
      "INSERT INTO users (firstName, lastName,  email, phoneNumber, password) VALUES ( ?, ?, ?, ?, ?)",
      [firstName, lastName, email, phoneNumber, hashPassword]
    );
    const data = {
      email: newUser.email,
      role: newUser.role,
    };
    const token = await jwt.sign(data, process.env.SECRET_TOKEN, {
      expiresIn: "2h",
    });
    //  verifying email address with nodemailer
    let mailOptions = {
      to: newUser.email,
      subject: "Verify Email",
      text: `Hi ${firstName}, Pls verify your email.
       ${token}`,
    };
    await sendMail(mailOptions);
    return successResMsg(res, 201, { message: "User created", newUser, token });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};

// verifying Email

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.headers;
    const decodedToken = await jwt.verify(token, process.env.SECRET_TOKEN);
    
    const user = await db.execute("SELECT * FROM users WHERE email = ?", [
      {
        email: decodedToken.email,
      },
    ]);
    if (user.verified) {
      return successResMsg(res, 200, {
        message: "user verified already",
      });
    }
    user.isVerified = true;
    user.save();
    return successResMsg(res, 201, { message: "User verified successfully" });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};
// logging in a user
const loginUser = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body; 
    // validate with joi
    const loginUser = await UserLogin.validateAsync(req.body);
  
    const phoneNumberExist = await db.execute(
      "SELECT phoneNumber FROM users WHERE phoneNumber = password");
    if (!phoneNumberExist) {
      return next(
        new AppError("PhoneNumber does not exist please sign-up", 400)
      );
    }
    
    if (phoneNumberExist.password) {
      return next(new AppError("User not Verified", 401));
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
      message: "User logged in sucessfully",
      token,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};


//   exporting modules
module.exports = {
  createUser,
  loginUser,
};
