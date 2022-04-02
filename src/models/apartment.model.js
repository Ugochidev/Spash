const mongoose = require("mongoose");

const ApartmentSchema = mongoose.Schema;

//signup for new admin
const apartmentSchema = new ApartmentSchema(
  {
    pictures: {
      type: [String],
      require: true,
    },
  },
  { timestamps: true }
);
//

const apartmentPicture = mongoose.model("apartmentPicture", apartmentSchema);

module.exports = apartmentPicture;
