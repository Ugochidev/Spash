const Reservation = ("../models/reservation.model")
exports.uploadReservation = async (req, res, next) => {
  try {
    const {reservation, time, date } = req.body;
    if (!reservation || !time || !date)
      return res.status(400).json({
        message: "please fill the required fields",
      });

    const uploads = new Reservation({
      reservation,
      time,
      date,
    });
    return res.status(201).json({
      uploads,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
exports.payment = async (req, res, next) => {
  try {
    console.log("here...........................");
    console.log(process.env.payStack_secret_key);
    const data = await axios({
      url: "https://api.paystack.co/transaction/initialize",
      method: "post",
      headers: {
        Authorization: `Bearer ${process.env.payStack_secret_key}`,
      },
      data: {
        email: "ugochukwuchioma16@gmail.com",
        amount: "4000",
      },
    });
    console.log(data);
    return res.status(200).json({
      data: data.data.data,
    });
  } catch (error) {
    console.log(error);
    message: error;
  }
};

exports.paymentVerification = async (req, res, next) => {
  try {
    const { reference } = req.query;
    console.log("here...........................");
    console.log(process.env.payStack_secret_key);
    const data = await axios({
      url: `https://api.paystack.co/transaction/verify/${reference}`,
      method: "get",
      headers: {
        Authorization: `Bearer ${process.env.payStack_secret_key}`,
      },
      data: {
        email: "ugochukwuchioma16@gmail.com",
        amount: "4000",
      },
    });
    console.log(data);
    return res.status(200).json({
      data: data.data.data.gateway_response,
    });
  } catch (error) {
    return errorResMsg(res, 500, { message: error.message });
  }
}