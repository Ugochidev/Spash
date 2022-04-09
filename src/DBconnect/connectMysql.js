const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();
// creating connection
const connection = mysql.createConnection({
  host: process.env.host,
  // port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

connection.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }

  console.log("Connected to the MySQL server.");
});
module.exports = connection.promise();
