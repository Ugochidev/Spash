//  require dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// creating  admin Scheme
const adminSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["ROLE_ADMIN"],
      default: "ROLE_ADMIN",
    },
  },
  {
    timestamps: true,
  }
);

//    exporting modules
module.exports = mongoose.model("Admin", adminSchema);
