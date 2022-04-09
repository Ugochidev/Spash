const express = require("express");
const app = express();
app.use(express.json());
const connectDB = require("./DBconnect/database");
const connection = require("./DBconnect/connectMysql");
const pool = require("./DBconnect/connectPGsql");
const router = require("./controllers/shortlets.controller");
const keycloak = require("./utils/keycloak").initKeycloak();
app.use(keycloak.middleware());
// const adminClient = require("./utils/keycloak.utils");
// Connecting to database
pool;
connection;
connectDB;
app.use(express.urlencoded({ extended: true }));
// connecting to a port
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});

module.exports = { app };
