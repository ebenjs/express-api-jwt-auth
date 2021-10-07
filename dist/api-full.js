const express = require("express");
const UserModel = require("../models/user");
const Utility = require("../modules/utility");
const router = express.Router();

// JWT Stuff
const jwt = require("jsonwebtoken");
const passportJWT = require("passport-jwt");
const { ExtractJwt } = passportJWT;
const JwtStrategy = passportJWT.Strategy;
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.APP_SECRET;
const strategy = new JwtStrategy(jwtOptions, (jwtPayload, next) => {
  UserModel.findById(jwtPayload.id, (error, user) => {
    if (error) console.log(error);
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

// Example of a login route
router.post("/login", (req, res) => {
  if (req.body.username && req.body.password) {
    const { username, password } = req.body;
    const authenticate = UserModel.authenticate();
    authenticate(username, password, (error, user) => {
      if (error) {
        console.log(error);
        res.status(500).json({
          status: 0,
          message: "Internal server error",
          error,
        });
      } else if (user) {
        const payload = { id: user.id };
        const token = jwt.sign(payload, jwtOptions.secretOrKey, {
          expiresIn: process.env.JWT_EXPIRES,
        });
        res
          .status(200)
          .json({ message: "User authentication successful", token, user });
      } else {
        res.status(401).json({ message: "User not found" });
      }
    });
  } else {
    res
      .status(400)
      .json({ message: "Bad request. Request body must not be empty." });
  }
});

// Example of a registration route
router.post("/register", async (req, res) => {
  const result = Utility.validateUser(req.body);
  if (result) {
    if ((await Utility.checkUserUnicity(req.body)) === true) {
      const { firstName, lastName, email } = req.body;
      const password = req.body.password.first;

      const user = new UserModel({
        firstName,
        lastName,
        username: email,
      });

      UserModel.register(user, password, (err) => {
        if (err)
          res
            .status(400)
            .json({ message: "Error occured when saving user", err });
        else res.status(200).json({ message: "User registered successfully" });
      });
    } else {
      res.status(400).json({ message: "User already exist" });
    }
  } else {
    res
      .status(400)
      .json({ message: "Could not validate user", errors: result });
  }
});

module.exports = router;
