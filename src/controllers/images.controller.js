// const Images = require("../models/image.model");
// const dotenv = require("dotenv");
// dotenv.config();
// const fs = require('fs');
// const { cloudinary, uploads } = require("../utils/cloudinary");

// module.exports = async (req, res) => {

//   const uploader = async (path) => await cloudinary.uploads(path, 'Images');

//   if (req.method === 'POST') {
//     const urls = []
//     const files = req.files;
//     for (const file of files) {
//       const { path } = file;
//       const newPath = await uploader(path)
//       urls.push(newPath)
//       fs.unlinkSync(path)
//     }

//     res.status(200).json({
//       message: 'images uploaded successfully',
//       data: urls
//     })

//   } else {
//     res.status(405).json({
//       err: `${req.method} method not allowed`
//     })
//   }
// }


