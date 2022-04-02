const multer = require("multer");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const maxSize = 10 * 1000 * 1000;

const upload = multer({
  storage,
  limits: { fileSize: maxSize },
});

module.exports = upload;
