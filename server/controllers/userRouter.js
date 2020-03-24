const userRouter = require("express").Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStartegy = require("passport-google-oauth20").Strategy;
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
        if (user.provider === "facebook") {
          return done(null, false, { message: "signedFace" });
        }
        if (user.provider === "google") {
          return done(null, false, { message: "signedGoogle" });
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
      profileFields: ["email", "photos", "gender", "displayName"]
    },
    function(accessToken, refreshToken, profile, cb) {
      User.findOne({ email: profile.emails[0].value }, async (err, user) => {
        if (err) {
          return cb(err);
        }
        if (!user) {
          const newUser = new User({
            email: profile.emails[0].value,
            name: profile.displayName,
            country: "",
            gender: profile.gender || "",
            provider: "facebook",
            userImage: profile.photos[0].value || "",
            images: []
          });
          await newUser.save(err => {
            if (err) cb(err);
          });
          return cb(err, newUser);
        }

        return cb(err, user, { message: "AlreadyIn" });
      });
    }
  )
);
passport.use(
  new GoogleStartegy(
    {
      clientID: config.GOOGLE.clientId,
      clientSecret: config.GOOGLE.clientSecret,
      callbackURL: "/user/login/google/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
      User.findOne({ email: profile.emails[0].value }, async (err, user) => {
        if (err) {
          return cb(err);
        }
        if (!user) {
          const newUser = new User({
            email: profile.emails[0].value,
            name: profile.displayName,
            country: "",
            gender: profile.gender || "",
            provider: "google",
            userImage: profile.photos[0].value || "",
            images: []
          });
          await newUser.save(err => {
            if (err) cb(err);
          });
          return cb(err, newUser);
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
  const exisitingUser = await User.findOne({ email: req.body.email });
  if (exisitingUser) {
    await req.login(exisitingUser, err => {
      if (err) return next(err);
    });
    return res.status(201).json({ message: "success" });
  }
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

userRouter.get(
  "/login/facebook",
  passport.authenticate("facebook", {
    scope: ["email"]
  })
);

userRouter.get("/login/facebook/callback", (req, res) => {
  passport.authenticate("facebook", (err, user, info) => {
    if (err) return console.log(err);
    if (!user) return res.json(info);
    req.login(user, err => {
      if (err) return console.log(err);
      return res.redirect("http://localhost:3000");
    });
  })(req, res);
});

userRouter.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

userRouter.get("/login/google/callback", (req, res) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) return console.log(err);
    if (!user) return res.json(info);
    req.login(user, err => {
      if (err) return console.log(err);
      return res.redirect("http://localhost:3000");
    });
  })(req, res);
});

module.exports = userRouter;
