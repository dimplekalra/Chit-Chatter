const User = require("../models/user");
const Guest = require("../models/guest");
const passport = require("passport");
const localStrategy = require("passport-local");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const config = require("./main");

const localoptions = {
  usernameField: "username",
};

const localLogin = new localStrategy(
  localoptions,
  (username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) return done(err);

      if (!user) {
        return done(null, false, {
          error: "login details could not be verified",
        });
      }

      user.comparePassword(password, (err, isMatch) => {
        if (err) return done(err);

        if (!isMatch) {
          return done(null, false, {
            error: "password is incorrect",
          });
        }

        return done(null, user);
      });
    });
  }
);

const jwtoptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secret,
};

const jwtlogin = new JwtStrategy(jwtoptions, (payload, done) => {
  User.findById(payload._id, function (err, user) {
    if (err) return done(null, false);

    if (user) {
      done(null, user);
    } else {
      Guest.findOne(payload.guestName, (err, guest) => {
        if (err) return done(err, false);

        if (guest) {
          done(null, guest);
        } else {
          done(null, false);
        }
      });
    }
  });
});

passport.use(localLogin);
passport.use(jwtlogin);
