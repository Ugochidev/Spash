// // const express = require("express");
// // const router = express.Router();
// // const theImages = require("../controllers/images.controller");
// // const upload = require("../utils/multer");

// const express = require("express");
// const bodyParser = require("body-parser");
// const app = express();
// const upload = require("../utils/multer");
// const cloudinary = require("../utils/cloudinary");
// const fs = require("fs");
// const router = express.Router();

// router.post("/upload-images", upload.array("image"), async (req, res) => {
//   const uploader = async (path) => await cloudinary.uploads(path, "Images");

//   if (req.method === "POST") {
//     const urls = [];
//     const files = req.files;
//     for (const file of files) {
//       const { path } = file;
//       const newPath = await uploader(path);
//       urls.push(newPath);
//       fs.unlinkSync(path);
//     }

//     res.status(200).json({
//       message: "images uploaded successfully",
//       data: urls,
//     });
//   } else {
//     res.status(405).json({
//       err: `${req.method} method not allowed`,
//     });
//   }
// });

// module.exports = router;
// // router.post("/postimages", upload.array("images", 4), theImages);

// // module.exports = router;
