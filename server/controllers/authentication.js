const User = require("../models/user");
const Guest = require("../models/guest");
const { exists } = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../config/main");

function generateToken(user) {
  const token = jwt.sign(user, config.secret, {
    expiresIn: 7200,
  });

  return token;
}

const setUser = (user) => {
  return {
    _id: user._id,
    username: user.username,
    usersChannel: user.usersChannel,
  };
};

exports.login = (req, res, next) => {
  const user = setUser(req.user);

  res.status(200).send({
    token: generateToken(user),
    user,
    message: "successfully logged in",
  });
};

exports.register = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username) {
    res.status(422).send({
      error: "please enter valid username",
    });

    return res.end();
  }
  if (!password) {
    res.status(422).send({
      error: "please enter valid password",
    });
    return res.end();
  }

  User.findOne({ username }, (err, existing) => {
    if (err) return next(err);

    if (existing) {
      res.status(422).send({ error: "Username is already in use" });
      return res.end();
    }

    let userRegister = new User({
      username,
      password,
    });

    userRegister.save((err, user) => {
      if (err) return next(err);
      const userInfo = setUser(user);

      res.status(200).send({
        token: generateToken(userInfo),
        user: userInfo,
        message: "successfully registered",
      });
      return res.end();
    });
  });
};

exports.guestLogin = (req, res, next) => {
  const guestName = req.body.guestInputName;

  if (!guestName) {
    res.status(422).send({
      message: "please enter valid guest name",
    });
  }

  Guest.findOne({ guestName }, async (err, guest) => {
    if (err) {
      return next(err);
    }

    if (!guest) {
      res.status(422).send({
        error: "guest name is not found",
      });
      return res.end();
    }

    console.log(guest);

    res.status(200).json({
      token: generateToken({ guest }),
      guest,
      message: "successfully created guest",
    });
  });
};

exports.guestSignup = (req, res, next) => {
  const guestName = req.body.guestInputName;

  if (!guestName) {
    res.status(422).send({
      error: "please enter valid guestname",
    });
  }

  Guest.findOne({ guestName }, (err, existing) => {
    if (err) return next(err);

    if (existing) {
      res.status(422).send({ error: "guestname is already in use" });
      return res.end();
    }

    let guest = new Guest({
      guestName,
    });

    User.findOne({ username: guestName }, (err, existingUser) => {
      if (err) return next(err);

      if (existingUser) {
        res.status(422).send({ error: "the guest name is already is use" });
        return res.end();
      } else {
        guest.save((err, user) => {
          if (err) return next(err);

          console.log(guest);

          res.status(200).send({
            token: generateToken({ guest }),
            guest,
            message: "successfully created a guest",
          });
          return res.end();
        });
      }
    });
  });
};
