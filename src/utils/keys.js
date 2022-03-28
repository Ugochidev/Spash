module.exports = {
  google: {
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
  },
  mongodb: {
    dbURI: process.env.DATABASE_URL,
  },
  session: {
    cookieKey: process.env.cookieKey,
  },
};
