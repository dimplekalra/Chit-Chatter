const User = require("../models/user");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users)
      return res.status(404).json({
        error: "No Users found",
      });

    return res.status(200).json({
      users,
      message: "Successfull",
    });
  } catch (error) {
    return res.status(422).json({
      error: "could not load users",
    });
  }
};

exports.addChannel = (req, res, next) => {
  const channelToAdd = req.body.createInput;
  const username = req.user.username;

  User.findOne({ username }, (err, user) => {
    if (err) {
      res.send({
        error: err,
      });
      return next(err);
    }

    if (!user) {
      return res.status(422).json({
        error: "could not find a user",
      });
    }

    if (user.usersChannel.indexOf(channelToAdd) == -1) {
      user.usersChannel.push(channelToAdd);
    } else {
      res.status(422).json({
        error: "already in use ",
      });
      return res.end();
    }

    user.save((err, updatedUser) => {
      if (err) {
        res.send({
          error: err,
        });
        return next(err);
      }

      res.status(200).json({
        channel: updatedUser.usersChannel,
        message: "successfully joined Channel",
      });
      return res.end();
    });
  });
};

exports.removeChannel = (req, res, next) => {
  const username = req.user.username;
  const channelToRemove = req.body.channel;

  User.findOne({ username }, (err, user) => {
    if (err) {
      res.send({
        error: err,
      });
      return next(err);
    }

    if (!user) {
      return res.status(422).json({
        error: "could not find a user",
      });
    }

    const removedchannel = user.usersChannel.filter(
      (channel) => channel != channelToRemove
    );

    user.usersChannel = removedchannel;

    user.save((err, updateduser) => {
      if (err) return next(err);
      return res.status(200).json({
        message: `channel removed: ${channelToRemove}`,
        updatedChannels: user.usersChannel,
      });
    });
  });
};

exports.getChannel = (req, res, next) => {
  const username = req.user.username;

  User.findOne({ username }, (err, user) => {
    if (err) return next(err);

    if (!user) {
      res.status(422).json({
        error: "could not find a user",
      });

      return res.end();
    }

    return res.status(200).json({
      message: "here are channel list",
      channels: user.usersChannel,
    });
  });
};
