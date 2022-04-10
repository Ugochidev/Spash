const Joi = require("joi");

const validateRegister = Joi.object({
  id: Joi.number(),
  firstName: Joi.string().min(3).max(20).required(),
  lastName: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(10).max(13).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required(),
});

const validateLogin = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required(),
});

const validiateUser = Joi.object({
  firstName: Joi.string().min(3).max(20).required(),
  lastName: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(10).max(13).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required(),
});

const UserLogin = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required(),
});
const validateshortlets = Joi.object({
  id: Joi.number(),
  apartmentName: Joi.string().max(20).required(),
  state: Joi.string().max(20).required(),
  numberOfRooms: Joi.string().max(13).required(),
  address: Joi.string().max(100).required(),
  amountPerNight: Joi.string().max(13).required(),
});
const validatebooking = Joi.object({
  id: Joi.number(),
  reservation: Joi.string().max(20).required(),
  time: Joi.string().max(20).required(),
  amountPerDay: Joi.string().max(13).required(),
  noOfNights: Joi.string().max(100).required(),
  noOfRooms: Joi.string().max(100).required(),
  totalAmount: Joi.string().max(13),
  shortlets_id: Joi.string().max(13),
  date: Joi.string().max(13).required(),
});
module.exports = {
  validateRegister,
  validateLogin,
  validiateUser,
  UserLogin,
  validatebooking,
  validateshortlets,
};
