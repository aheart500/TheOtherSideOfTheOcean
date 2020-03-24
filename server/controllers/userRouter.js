const userRouter = require("express").Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");
const bcrypt = require("bcrypt");
const config = require("../utils/config");

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

passport.use(
  new FacebookStrategy(
    {
      clientID: config.FACEBOOK.clientId,
      clientSecret: config.FACEBOOK.clientSecret,
      callbackURL: "/user/login/facebook/callback",
      profileFields: ["email", "gender", "location", "name", "profile_pic"]
    },
    function(accessToken, refreshToken, profile, cb) {
      User.findOne({ email: profile.email }, (err, user) => {
        if (err) {
          return cb(err);
        }
        if (!user) {
          const user = new User({
            email: profile.email,
            name: profile.name,
            country: profile.location || "",
            provider: "facebook",
            userImage: profile["profile_pic"] || "",
            images: []
          });
          user.save(err => {
            if (err) console.log(err);
            return cb(err, user);
          });
        }
        return cb(err, user, { message: "AlreadyIn" });
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

userRouter.get("/login/facebook", passport.authenticate("facebook"));

userRouter.get("/login/facebook/callback", (req, res) => {
  passport.authenticate("facebook", (err, user, info) => {
    if (err) return console.log(err);
    if (!user) return res.json(info);
    req.login(user, err => {
      if (err) return console.log(err);
      return res.json(user);
    });
  })(req, res);
});
module.exports = userRouter;
