const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const userRouter = require("./controllers/userRouter");
const config = require("./utils/config");
const mongoose = require("mongoose");
var cors = require("cors");

mongoose
  .connect(config.MonogDB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(console.log("connected successfully to the database"))
  .catch(err => {
    console.log(err);
  });

app.use(bodyParser.json());

app.use(express.static("build"));
app.use(
  session({
    secret: config.SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

app.use("/user", userRouter);

const errorHandler = (error, req, res, next) => {
  console.error(error.messsage);

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "invalid token"
    });
  }

  next(error);
};
app.use(errorHandler);

module.exports = app;
