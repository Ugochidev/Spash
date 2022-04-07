const cloudinary = require("cloudinary");
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const cloudinaryUploadMethod = async (file) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(file, (err, res) => {
      if (err) return res.status(500).send("upload file error");
      // console.log( res.secure_url )
      resolve({
        res: res.secure_url,
      });
    });
  });
};
module.exports = cloudinaryUploadMethod;
