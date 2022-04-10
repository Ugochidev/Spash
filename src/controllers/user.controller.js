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
    await validiateUser.validateAsync(req.body);
    // checking if a user already has an account
    const [user] = await db.execute(
      "SELECT `email` FROM `users` WHERE `email` = ?",
      [req.body.email]
    );

    if (user.length > 0) {
      return res.status(400).json({
        message: "the email already exist",
      });
    }
    //  hashing password
    const hashPassword = await bcrypt.hash(password, 10);

    // creating a new user
    const [newUser] = await db.execute(
      "INSERT INTO users (firstName, lastName,  email, phoneNumber, password) VALUES ( ?, ?, ?, ?, ?)",
      [firstName, lastName, email, phoneNumber, hashPassword]
    );
    // creating a payload
    const data = {
      id: newUser.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      role: req.body.role,
      isVerified: req.body.isVerified,
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
    return successResMsg(res, 201, { message: "User created", data, token });
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

    const verify = await db.execute(
      "UPDATE users SET isVerified = true WHERE isVerified = false"
    );
    return successResMsg(res, 201, { message: "User verified successfully" });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};
// logging in a user
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // validate with joi
    await UserLogin.validateAsync(req.body);
    //  checking email and password match
    if (email && password) {
      const [user] = await db.execute("SELECT * FROM users WHERE email =?", [
        email,
      ]);
      if (user.length === 0) {
        return res.status(400).json({
          message: "email address not found.",
        });
      }
      const passMatch = await bcrypt.compare(password, user[0].password);
      if (!passMatch) {
        return res.status(400).json({ message: "incorrect paaword" });
      }
      if (user[0].isVerified === 0) {
        return res.status(400).json({
          message: "Unverified account.",
        });
      }
    }
    // creating a payload
    const data = {
      email: email.email,
      role: email.role,
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

const forgetPasswordLink = async (req, res, next) => {
  try {
    const { email } = req.body;
    const [user] = await db.execute("SELECT * FROM users WHERE email =?", [
      email,
    ]);
    if (user.length === 0) {
      return res.status(400).json({
        message: "email address not found.",
      });
    }
    const data = {
      email: user[0].email,
      role: user[0].role,
    };
    // getting a secret token
    const secret_key = process.env.SECRET_TOKEN;
    const token = await jwt.sign(data, secret_key, { expiresIn: "1hr" });
    await jwt.verify(token, secret_key);

    let mailOptions = {
      to: email.email,
      subject: "Reset Password",
      text: `Hi ${email.firstName}, Reset your password with the link below.${token}`,
    };
    await sendMail(mailOptions);
    return successResMsg(res, 200, {
      message: `Hi ${user[0].firstName},reset password.`,
      token,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { email, token } = req.query;
    const secret_key = process.env.SECRET_TOKEN;
    const decoded_token = await jwt.verify(token, secret_key);

    if (decoded_token.email !== email) {
      return next(new AppError("Email do not match.", 404));
    }
    if (newPassword !== confirmPassword) {
      return next(new AppError("Password do not match.", 404));
    }
    const hashPassword = await bcrypt.hash(confirmPassword, 10);
    const updatedPassword = await db.execute(
      "UPDATE users SET isVerified = true WHERE isVerified = true"
    );
    return successResMsg(res, 200, {
      message: `Password has been updated successfully.`,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const { email } = req.query;
    const loggedUser = await db.execute("SELECT * FROM users WHERE email =?", [
      email,
    ]);
    const headerTokenEmail = await jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.SECRET_TOKEN
    ).email;
    
    console.log(headerTokenEmail);
    if (headerTokenEmail !== loggedUser[0][0].email) {
      return next(new AppError("Forbidden", 404));
    }


    const passwordMatch = await bcrypt.compare(
      oldPassword,
      loggedUser[0][0].password
    );

    if (!passwordMatch) {
      return next(new AppError("old Password is not correct.", 404));
    }

    if (newPassword !== confirmPassword) {
      return next(new AppError("Password do not match.", 400));
    }

    const hashPassword = await bcrypt.hash(confirmPassword, 10);

    const resetPassword = await db.execute(
      "SELECT * FROM users WHERE email =?",
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
  createUser,
  verifyEmail,
  loginUser,
  forgetPasswordLink,
  changePassword,
  resetPassword,
};
