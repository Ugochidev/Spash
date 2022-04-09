const session = require("express-session");
const Keycloak = require("keycloak-connect");
const express = require("express");
const app = express();

let _keycloak;

const keycloakConfig = {
  clientId: "spashShortlets",
  bearerOnly: true,
  serverUrl: "http://localhost:8080/auth",
  realm: "spash-Realm",
  credentials: {
    secret: "MAv91kY6xh3csRDYQ2JfKpGdxExXCVWi",
  },
};

function initKeycloak() {
  if (_keycloak) {
    console.warn("Trying to init Keycloak again!");
    return _keycloak;
  } else {
    console.log("Initializing Keycloak...");
    const memoryStore = new session.MemoryStore();
    app.use(
      session({
        secret: "some secret",
        resave: false,
        saveUninitialized: true,
        store: memoryStore,
      })
    );
    _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
    return _keycloak;
  }
}

function getKeycloak() {
  if (!_keycloak) {
    console.error(
      "Keycloak has not been initialized. Please called init first."
    );
  }
  return _keycloak;
}

module.exports = {
  initKeycloak,
  getKeycloak,
};
