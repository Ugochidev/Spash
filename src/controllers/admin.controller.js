//  Require dependencies
const Admin = require("../models/user.model");
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
const db = require("../DBconnect/connectMysql");

//  creating  a user
const createAdmin = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber, email, password } = req.body;
    // validating reg.body with joi
    const registerAdmin = await validateRegister.validateAsync(req.body);
    const [row] = await db.execute(
      "SELECT `email` FROM `users` WHERE `email` = ?",
      [req.body.email]
    );

    if (row.length > 0) {
      return res.status(400).json({
        message: "the email already exist",
      });
    }
    console.log(row);
    //  hashing password
    const hashPassword = await bcrypt.hash(password, 10);

    // creating a new user
    const [newAdmin] = await db.execute(
      "INSERT INTO admin (firstName, lastName,  email, phoneNumber, password) VALUES ( ?, ?, ?, ?, ?)",
      [firstName, lastName, email, phoneNumber, hashPassword]
    );
    const data = {
      id: row[0],
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      Password: req.body.hashPassword,
      role: req.body.role,
      isVerified: req.body.isVerified,
    };
    const token = await jwt.sign(data, process.env.SECRET_TOKEN, {
      expiresIn: "2h",
    });
    // const decodedToken = await jwt.verify(token, process.env.SECRET_TOKEN);
    // console.log(decodedToken);
    //  verifying email address with nodemailer
    let mailOptions = {
      to: newAdmin.email,
      subject: "Verify Email",
      text: `Hi ${firstName}, Pls verify your email.
       ${token}`,
    };
    await sendMail(mailOptions);
    return successResMsg(res, 201, { message: "Admin created", data, token });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};

// verifying Email

const verifyEmailAddress = async (req, res, next) => {
  try {
    const { token } = req.headers;
    const decodedToken = await jwt.verify(token, process.env.SECRET_TOKEN);
    const admin = await db.execute("SELECT * FROM admin WHERE email = ?", [
      {
        email: decodedToken.email,
      },
    ]);
    // console.log("decodedToken");
    if (admin.verified) {
      return successResMsg(res, 200, {
        message: "admin verified already",
      });
    }

    const verify = await db.execute(
      "UPDATE admin SET isVerified = true WHERE isVerified = false"
    );
    return successResMsg(res, 201, { message: "Admin verified successfully" });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};
// logging in a Admin
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // validate with joi
    if (email && password) {
      const [row] = await db.execute("SELECT * FROM admin WHERE email =?", [
        email,
      ]);
      // console.log([row])
      emailexist = [row];

      // console.log("heyy");
      console.log(emailexist);
      // console.log("heyy");
      if (row.length === 0) {
        return res.status(400).json({
          message: "email address not found.",
        });
      }
      console.log("here");
      const passMatch = await bcrypt.compareSync(password, row[0].password);
      if (!passMatch) {
        return res.status(400).json({ message: "incorrect paaword" });
      }
      if (row[0].isVerified === 0) {
        return res.status(400).json({
          message: "Unverified account.",
        });
      }
    }
    const validLogin = await validateLogin.validateAsync(req.body);
    const data = {
      email: emailexist[0][0].email,
      phoneNumber: emailexist[0][0].phoneNumber,
      role: emailexist[0][0].role,
    };
 console.log(emailexist[0][0].role);
    const token = await jwt.sign(data, process.env.SECRET_TOKEN, {
      expiresIn: "1h",
    });
    console.log(await jwt.verify(token, process.env.SECRET_TOKEN));
    return successResMsg(res, 200, {
      message: "Admin logged in sucessfully",
      token,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};

const forgetPasswordLinkAdmin = async (req, res, next) => {
  try {
    const { email } = req.body;
    const [row] = await db.execute("SELECT * FROM admin WHERE email =?", [
      email,
    ]);
    if (row.length === 0) {
      return res.status(400).json({
        message: "email address not found.",
      });
    }
    // console.log(row);
    const data = {
      phone: row[0].phoneNumber,
      email: row[0].email,
      role: row[0].role,
    };
    // console.log
    // getting a secret token
    const secret_key = process.env.SECRET_TOKEN;
    const token = await jwt.sign(data, secret_key, { expiresIn: "1hr" });
    const detoken = await jwt.verify(token, secret_key);
    console.log(detoken);
    let mailOptions = {
      to: email.email,
      subject: "Reset Password",
      text: `Hi ${email.firstName}, Reset your password with the link below.${token}`,
    };
    await sendMail(mailOptions);
    return successResMsg(res, 200, {
      message: `Hi ${row[0].firstName},reset password.`,
      token,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};

const forgetPassword = async (req, res, next) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { email, token } = req.query;
    const secret_key = process.env.SECRET_TOKEN;
    const decoded_token = await jwt.verify(token, secret_key);
    console.log(email);
    console.log(decoded_token);
    if (decoded_token.email !== email) {
      return next(new AppError("Email do not match.", 404));
    }
    if (newPassword !== confirmPassword) {
      return next(new AppError("Password do not match.", 404));
    }
    const hashPassword = await bcrypt.hash(confirmPassword, 10);
    const updatedPassword = await db.execute(
      "UPDATE admin SET isVerified = true WHERE isVerified = true"
    );
    return successResMsg(res, 200, {
      message: `Password has been updated successfully.`,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const { email } = req.query;
    const loggedAdmin = await db.execute("SELECT * FROM admin WHERE email =?", [
      email,
    ]);
    const headerTokenEmail = await jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.SECRET_TOKEN
    ).email;
    // console.log(headerTokenEmail);
    // console.log(loggedUser[0][0].email);
    if (headerTokenEmail !== loggedAdmin[0][0].email) {
      return next(new AppError("Forbidden", 404));
    }
    // console.log(typeof loggedUser[0][0].password);
    // console.log(typeof oldPassword);
    // console.log(await bcrypt.compare(oldPassword, loggedUser[0][0].password));
    // console.log(await bcrypt.compare(loggedUser[0][0].password, oldPassword));
    // console.log(loggedUser[0][0].password);
    const passwordMatch = await bcrypt.compare(
      oldPassword,
      loggedAdmin[0][0].password
    );
    // console.log(oldPassword);
    // console.log("//////////////////////////////////////")
    if (!passwordMatch) {
      return next(new AppError("old Password is not correct.", 404));
    }

    if (newPassword !== confirmPassword) {
      return next(new AppError("Password do not match.", 400));
    }

    const hashPassword = await bcrypt.hash(confirmPassword, 10);

    const resetPassword = await db.execute(
      "SELECT * FROM admin WHERE email =?",
      [email],
      [{ password: hashPassword }]
    );
    return successResMsg(res, 200, {
      message: `Password has been updated successfully.`,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};

//   exporting modules
module.exports = {
  createAdmin,
  verifyEmailAddress,
  loginAdmin,
  forgetPasswordLinkAdmin,
  forgetPassword,
  updatePassword,
};
