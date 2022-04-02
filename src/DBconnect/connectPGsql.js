// const { Client } = require("pg");

// const client = new Client({
//   host: "localhost",
//   user: "postgres",
//   post: 5432,
//   password: "ikefedeco2016",
//   database: "SpashShortlets",
// });
// client.connect();

// client.query("Select * from spash-shortlets2", (err, res) => {
//   if (!err) {
//     console.log("connected to pgsql");
//   } else {
//     console.log(err.message);
//   }
// });

const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

// ==> Conexão com a Base de Dados:
const pool = new Pool({
  host: process.env.hostpg,
  user:process.env.userpg,
  post: process.env.postpg,
  password: process.env.passwordpg,
  database: process.env.databasepg,
});

pool.query('SELECT NOW()', (err, res) => {
  if (!err) {
    console.log("connected to PGsql");
  } else {
    console.log(err.message);
  }
  //   console.log("connected PGSQL");
});

module.exports = pool;
