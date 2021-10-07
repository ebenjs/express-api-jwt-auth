const express = require("express");
const UserModel = require("../models/user");
const router = express.Router();

// JWT Stuff
const jwt = require("jsonwebtoken");
const passportJWT = require("passport-jwt");
const { ExtractJwt } = passportJWT;
const JwtStrategy = passportJWT.Strategy;
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = "app-secret";
const strategy = new JwtStrategy(jwtOptions, (jwtPayload, next) => {
  UserModel.findById(jwtPayload.id, (error, user) => {
    if (error) throw error;
    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  });
});

// Passport
const passport = require('passport');
passport.use(strategy);
router.use(passport.initialize());

// Example of a protected route
router.get("/secret",passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json("Success!");
  }
);

// Example of a non protected route
router.get("/free",
    (req, res) => {
      res.status(200).json("Success!");
    }
);

module.exports = router;
