const userRouter = require("express").Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require("bcrypt");
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    function(email, password, done) {
      User.findOne({ email: email }, async function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        if (!(await user.validPassword(password))) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      });
    }
  )
);

userRouter.get("/logged", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json(req.user);
  }
  return res.json({ logged: false });
});
userRouter.get("/logout", (req, res) => {
  req.logout();
  return res.json({ message: "logged out" });
});
userRouter.post("/login", (req, res) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return console.log(err);
    if (!user) return res.json(info);
    req.login(user, err => {
      if (err) return console.log(err);
      return res.json(user);
    });
  })(req, res);
});
userRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new User({
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      name: req.body.name || "John Doe",
      gender: req.body.gender || "Unset",
      country: req.body.country || "Unset",
      provider: "local",
      userImage: "",
      images: []
    });
    const saved = await newUser.save();
    req.login(saved, err => {
      if (err) return next(err);
      return res.status(201).json({ message: "success" });
    });
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
