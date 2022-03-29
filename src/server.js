const express = require("express");
const cookieSession = require("cookie-session");
const passport = require("passport");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
const passportSetup = require("./utils/passport-setup");
const mongoose = require("mongoose");
const keys = require("./utils/keys");
const { app } = require("./app");
const dotenv = require("dotenv");
dotenv.config();
const UsersRouter = require("./routes/user.route.js");

app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});
// set view engine
app.set("view engine", "ejs");

// set up session cookies
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey],
  })
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// set up routes
app.use("/api/v1", UsersRouter);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
