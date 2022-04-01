const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456789",
  database: "spash",
});

connection.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }

  console.log("Connected to the MySQL server.");
});
module.exports = connection;
