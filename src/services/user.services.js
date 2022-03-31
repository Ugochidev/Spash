
const User = require("../models/user.model.sql");
const db = require("../DBconnect/connectMysql");
const appError = require("../utils/appError");
const { successResMsg, errorResMsg } = require("../utils/response");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { SECRET_TOKEN } = process.env;

// console.log(users);

const userServices = {
  async fetchUsers(req, res) {
    const users = await db.execute("SELECT * FROM users");
    const validUsers = await users[0].map((user) => user);
    return validUsers;
  },

  async signUp(user) {
    let userDetails = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phonenumber: user.phonenumber,
      password: user.username,
      isVerified: user.isVerified,
      role: user.role,
    };
    try {
      const newUser = await db.execute(
        "INSERT INTO users (firstName, lastName, email, phonenumber, password, isVerified, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          userDetails.firstname,
          userDetails.lastname,
          userDetails.email,
          userDetails.phonenumber,
          userDetails.password,
          userDetails.isVerified,
          userDetails.role,
        ]
      );
      if (userDetails.email === email) {
        throw new Error("This email already exist");
      }
      return newUser;
    } catch (error) {
      return new customError(500, "Server Error");
    }
  },

  async login(email) {
    try {
      const users = await db.execute("SELECT * FROM users");
      const foundUser = users[0].find((user) => user.email == email);
      if (!foundUser) {
        return new customError(401, "user not found!");
      }
      const SECRET_TOKEN = jwt.sign(foundUser.email, SECRET_TOKEN);
      return { foundUser, token: accessToken } || {};
    } catch (error) {
      return new customError(500, "Server Error");
    }
  },
};

module.exports = userServices;
