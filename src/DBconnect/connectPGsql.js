const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

// creating connection:
const pool = new Pool({
  host: process.env.hostpg,
  user:process.env.userpg,
  port: process.env.portpg,
  password: process.env.passwordpg,
  database: process.env.databasepg,
});

pool.query('SELECT NOW()', (err, res) => {
  if (!err) {
    console.log("connected to PGsql");
  } else {
    console.log(err.message);
  }
});

module.exports = pool;
