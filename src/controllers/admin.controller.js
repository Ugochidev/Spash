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
    // // validating phoneNumber
    // const phoneNumberExist = await db.query(
    //   "SELECT * FROM admin WHERE  phoneNumber = ?",
    //   [phoneNumber == phoneNumber]
    // );
    // if (phoneNumberExist) {
    //   return next(new AppError("PhoneNumber already exist please login", 400));
    // // }
    // console.log("phoneNumberExist");
    // // validating email
    // const emailExist = await db.query("SELECT * FROM admin WHERE  email = ?", [
    //   email === email,
    // ]);
    // if (emailExist) {
    //   return next(new AppError("email exists, please login", 400));
    // }

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

// verifying Email

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.headers;
    const decodedToken = await jwt.verify(token, process.env.SECRET_TOKEN);
    // const admin = await Admin.findOne({ email: decodedToken.email }).select(
    //   "isVerified"
    // );
    const admin = await db.execute("SELECT * FROM admin WHERE email = ?", [
      {
        email: decodedToken.email,
      },
    ]);
    if (admin.isVerified) {
      return successResMsg(res, 200, {
        message: "admin verified already",
      });
    }
    admin.isVerified = true;
    admin.save();
    return successResMsg(res, 201, { message: "Admin verified successfully" });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};
//  login for Admin
const loginAdmin = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;
    const login = await validateLogin.validateAsync(req.body);

    const phoneNumberExist = await Admin.findOne({ phoneNumber });
    if (!phoneNumberExist) {
      return next(
        new AppError("PhoneNumber does not exist please sign-up", 400)
      );
    }
    let isPasswordExist = await bcrypt.compare(
      password,
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

const forgetPassLink = async (req, res, next) => {
  try {
    const { email } = req.body;
    const adminEmail = await Admin.findOne({ email });
    if (!adminEmail) {
      return next(new AppError("email not found", 404));
    }
    const data = {
      id: adminEmail._id,
      email: adminEmail.email,
      role: adminEmail.role,
    };
    // getting a secret token
    const secret_key = process.env.SECRET_TOKEN;
    const token = await jwt.sign(data, secret_key, { expiresIn: "1hr" });
    let mailOptions = {
      to: adminEmail.email,
      subject: "Reset Password",
      text: `Hi ${adminEmail.firstName}, Reset your password with the link below.${token}`,
    };
    await sendMail(mailOptions);
    return successResMsg(res, 200, {
      message: `Hi ${adminEmail.firstName},reset password.`,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};

const changePass = async (req, res, next) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { email, token } = req.headers;
    const secret_key = process.env.SECRET_TOKEN;
    const decoded_token = await jwt.verify(token, secret_key);
    if (decoded_token.email !== email) {
      return next(new AppError("Email do not match.", 404));
    }
    if (newPassword !== confirmPassword) {
      return next(new AppError("Password do not match.", 404));
    }
    const hashPassword = await bcrypt.hash(confirmPassword, 10);
    const updatedPassword = await Admin.updateOne(
      { email },
      { password: hashPassword },
      {
        new: true,
      }
    );
    return successResMsg(res, 200, {
      message: `Password has been updated successfully.`,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};

const resetPass = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const { email } = req.headers;
    const loggedAdmin = await Admin.findOne({ email });
    const headerTokenEmail = await jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.SECRET_TOKEN
    ).email;
    if (headerTokenEmail !== loggedAdmin.email) {
      return next(new AppError("Forbidden", 404));
    }
    const passwordMatch = await bcrypt.compare(
      oldPassword,
      loggedAdmin.password
    );
    if (!passwordMatch) {
      return next(new AppError("old Password is not correct.", 404));
    }
    if (newPassword !== confirmPassword) {
      return next(new AppError("Password do not match.", 400));
    }
    const hashPassword = await bcrypt.hash(confirmPassword, 10);
    const resetPassword = await Admin.updateOne(
      { email },
      { password: hashPassword }
    );
    return successResMsg(res, 200, {
      message: `Password has been updated successfully.`,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};

//  exporting module
module.exports = {
  createAdmin,
  verifyEmail,
  loginAdmin,
};
