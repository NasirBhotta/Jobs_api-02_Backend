require("dotenv").config();
require("express-async-errors");
const express = require("express");
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const app = express();
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");
const session = require("express-session");
// const MongoStore = require("connect-mongodb-session")(session);
const { v4: uuidv4 } = require("uuid");
app.use(express.json());
app.use(express.static("../frontend"));
const generateUUID = () => {
  return uuidv4();
};
// session-cookie
app.use(
  session({
    secret: process.env.JWT_SECRET,
    genid: generateUUID,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      secure: false,
    },
  })
);

//routes

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

// errors
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
