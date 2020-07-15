const User = require("../models/user");
const Guest = require("../models/guest");
const Conversation = require("../models/conversation");
const Message = require("../models/message");

const Channel = require("../models/channel.js");
// const conversation = require("../models/conversation");

exports.newConversation = (req, res, next) => {
  const recipient = req.body.startDMInput;
  const user = req.user;

  if (!recipient) {
    res.status(422).json({ error: "Enter a valid recipient" });
    return next();
  }
  User.findOne({ username: recipient }, (err, foundrecipient) => {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    if (!foundrecipient) {
      res.status(422).json({ error: "could not find a recipient" });
    }

    const conversation = new Conversation({
      participants: [user._id, foundrecipient._id],
    });

    conversation.save((err, newConversation) => {
      if (err) {
        res.status(422).send({ error: err });
        return next(err);
      }

      res.status(200).send({
        message: `started conversation with ${foundrecipient.username}`,
        recipientId: foundrecipient._id,
        recipient: foundrecipient.username,
      });
    });
  });
};

exports.leaveConversation = function (req, res, next) {
  const conversationToLeave = req.body.conversationId;

  Conversation.findOneAndRemove(
    { participants: conversationToLeave },
    (err, foundConversation) => {
      if (err) {
        res.status().json({ error: err });
        return next(err);
      }

      res.status(200).json({
        message: "Left the conversation",
      });

      return next();
    }
  );
};
exports.postToChannel = (req, res, next) => {
  const channelName = req.params.channelName;
  const composedMessage = req.body.composedMessage;
  console.log(channelName);
  if (!channelName) {
    res.status(422).json({
      error: "please enter valid channel name",
    });
    return next();
  }

  if (!composedMessage) {
    res.status(422).json({
      error: "please enter message",
    });
    return next();
  }

  const channel = new Channel({
    channelName,
  });

  channel.save((err, channelpost) => {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    const channelAuthor = () => {
      if (req.user.username) {
        let author = {
          kind: "users",
          item: req.user._id,
        };
        return author;
      } else {
        let guestAuthor = {
          kind: "guests",
          item: req.user._id,
        };
        return guestAuthor;
      }
    };

    let post = new Message({
      conversationId: channelpost._id,
      body: composedMessage,
      author: [channelAuthor()],
      channelName,
      guestPost: req.user.guestName || "",
    });

    post.save((err, newPost) => {
      if (err) {
        res.json({ error: err });
      }

      res.status(200).send({
        message: `posted to channel ${channelName}`,
        conversationId: newPost._id,
        postedMessage: composedMessage,
      });
    });
  });
};

const userdbs = { User: User, Guest: Guest };

exports.getChannelConversations = (req, res, next) => {
  const channelName = req.params.channelName;

  Message.find({ channelName })
    .select("createdAt body author guestPost")
    .sort("-createdAt")
    .populate("author.item")
    .exec(async (err, message) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }

      let getRecent = message.reverse();

      res.status(200).json({
        channelMessages: getRecent,
      });
    });
};

exports.getConversation = async (req, res, next) => {
  const username = req.user.username;

  const conversations = await Conversation.find({
    participants: req.user._id,
  })
    .sort("_id")
    .populate({ path: "participants", select: "username" });

  // if (!conversations) {
  //   res.status(422).json({ error: "error is there" });
  //   return res.end();
  // }

  if (conversations.length === 0) {
    console.log("sending the response");
    res.status(200).json({ message: "No Conversation Yet" });
    return res.end();
  }

  let conversationList = [];

  conversations.forEach((conversation) => {
    const conversationWith = conversation.participants.filter((item) => {
      return item.username !== username;
    });

    conversationList.push(conversationWith[0]);
    if (conversationList.length === conversations.length) {
      return res.status(200).json({
        conversationWith: conversationList,
      });
    }
  });
  // });
};

exports.sendReply = (req, res, next) => {
  const privateMessage = req.body.privateMessageInput;
  const recipientId = req.body.recipientId;
  const userId = req.user._id;
  console.log(privateMessage, recipientId, userId);
  Conversation.findOne(
    { participants: { $all: [userId, recipientId] } },
    (err, foundConversation) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }

      if (!privateMessage) {
        res.status(200).json({ message: "please enter message" });
        return next();
      }

      let reply = new Message({
        conversationId: foundConversation._id,
        body: privateMessage,
        author: {
          kind: "users",
          item: req.user._id,
        },
      });

      reply.save((err, sendreply) => {
        if (err) {
          res.send({ error: err });
          return next(err);
        }
        res.status(200).json({
          message: "Reply Sent",
        });
        return next();
      });
    }
  );
};

exports.getPrivateMessages = (req, res, next) => {
  const userId = req.user._id;
  const recipientId = req.params.recipientId;

  Conversation.findOne(
    { participants: { $all: [userId, recipientId] } },
    (err, foundConversation) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }

      if (!foundConversation) {
        res.status(200).send({ message: "No Conversation Yet" });
        return res.end();
      }

      Message.find({ conversationId: foundConversation._id })
        .select("createdAt body author")
        .sort("-createdAt")
        .populate("author.item")
        .exec((err, message) => {
          if (err) {
            res.send({ error: err });
            return next(err);
          }

          const sortedMessage = message.reverse();

          res.status(200).json({
            conversation: sortedMessage,
            conversationId: foundConversation._id,
          });
        });
    }
  );
};
