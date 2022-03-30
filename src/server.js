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
const userRouter = require("./routes/user.route.js");
const adminRouter = require("./routes/admin.route");
const bookingRouter = require("./routes/booking.route");
const image = require("./routes/image.route")

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
app.use("/api/v1", userRouter);
app.use("/api/v1", adminRouter);
app.use("/api/v1", bookingRouter);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);























// app.use("/api/v1", image);













































// const http = require("http");
// const app = require("./app");
// const bodyParser = require("body-parser");
// const port = process.env.PORT || 3000;
// const server = http.createServer(app);
// const appRoute = require("./routes/image.route");
// app.use(
//   bodyParser.urlencoded({
//     extended: false,
//   })
// );
// app.use(bodyParser.json());

// app.use("/i", appRoute);
// server.listen(port, () => {
//   console.log(port);
// });

// var express = require("express");
// var multer = require("multer");
// var port = 3000;

// var app = express();

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// var upload = multer({ storage: storage });

// const cloudinary = require("cloudinary").v2;
// const bodyParser = require("body-parser");
// const fs = require("fs");

// // body parser configuration
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static(__dirname + "/public"));
// app.use("/uploads", express.static("uploads"));

// // cloudinary configuration
// cloudinary.config({
//   cloud_name: "dznv66mjf",
//   api_key: "448868587565921",
//   api_secret: "QpCjtOqGk718rTXhU7BUu43bqoc",
// });

// async function uploadToCloudinary(locaFilePath) {
//   // locaFilePath :
//   // path of image which was just uploaded to "uploads" folder

//   var mainFolderName = "main";
//   // filePathOnCloudinary :
//   // path of image we want when it is uploded to cloudinary
//   var filePathOnCloudinary = mainFolderName + "/" + locaFilePath;

//   return cloudinary.uploader
//     .upload(locaFilePath, { public_id: filePathOnCloudinary })
//     .then((result) => {
//       // Image has been successfully uploaded on cloudinary
//       // So we dont need local image file anymore
//       // Remove file from local uploads folder
//       fs.unlinkSync(locaFilePath);

//       return {
//         message: "Success",
//         url: result.url,
//       };
//     })
//     .catch((error) => {
//       // Remove file from local uploads folder
//       fs.unlinkSync(locaFilePath);
//       return { message: "Fail" };
//     });
// }

// function buildSuccessMsg(urlList) {
//   // Building success msg
//   var response = '<h1><a href="/">Click to go to Home page</a><br></h1><hr>';

//   for (var i = 0; i < urlList.length; i++) {
//     response += "File uploaded successfully.<br><br>";
//     response += `FILE URL: <a href="${urlList[i]}">${urlList[i]}</a>.<br><br>`;
//     response += `<img src="${urlList[i]}" /><br><hr>`;
//   }

//   response += `<br><p>Now you can store this url in database or do anything with it  based on use case.</p>`;
//   return response;
// }

// app.post(
//   "/profile-upload-single",
//   upload.single("profile-file"),
//   async (req, res, next) => {
//     // req.file is the `profile-file` file
//     // req.body will hold the text fields, if there were any
//     var locaFilePath = req.file.path;
//     var result = await uploadToCloudinary(locaFilePath);
//     var response = buildSuccessMsg([result.url]);

//     return res.send(response);
//   }
// );

// app.post(
//   "/profile-upload-multiple",
//   upload.array("profile-files", 12),
//   async (req, res, next) => {
//     // req.files is array of `profile-files` files
//     // req.body will contain the text fields, if there were any
//     var imageUrlList = [];

//     for (var i = 0; i < req.files.length; i++) {
//       var locaFilePath = req.files[i].path;
//       var result = await uploadToCloudinary(locaFilePath);
//       imageUrlList.push(result.url);
//     }
//     // var response = buildSuccessMsg(imageUrlList)
//     console.log("hhdhjdjdd")
//     return res.json({
//       imageUrlList,
//     });
//   }
// );
// app.listen(3000, () => {
//   console.log("GGGG");
// });
