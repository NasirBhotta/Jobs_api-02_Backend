const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
require("dotenv").config();
const sessionCookie = (req, res, next) => {
  try {
    session({
      secret: process.env.JWT_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      },
      store: new MongoStore({
        uri: process.env.MONGO_URI,
        collection: "sessions",
      }),
    });
    console.log("working");
    next();
  } catch (error) {
    console.log(error, "this is error");
  }
};

module.exports = sessionCookie;
