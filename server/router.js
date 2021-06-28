const userController = require("./controllers/user");
const AuthenticatioController = require("./controllers/authentication");
const chatController = require("./controllers/chat");
const express = require("express");
const passportService = require("./config/passport");
const passport = require("passport");

const requireLogin = passport.authenticate("local", { session: false });
const requireAuth = passport.authenticate("jwt", { session: false });

module.exports = function (app) {
  const apiRoutes = express.Router();
  const authRoutes = express.Router();
  const chatRoutes = express.Router();
  const userRoutes = express.Router();

  apiRoutes.use("/auth", authRoutes);

  authRoutes.post("/register", AuthenticatioController.register);
  authRoutes.post("/login", requireLogin, AuthenticatioController.login);
  authRoutes.post("/guestSignup", AuthenticatioController.guestSignup);
  authRoutes.post(
    "/guestLogin",

    AuthenticatioController.guestLogin
  );

  apiRoutes.use("/chat", chatRoutes);
  //privatemessages
  chatRoutes.get("/", requireAuth, chatController.getConversation);
  chatRoutes.get(
    "/privatemessages/:recipientId",
    requireAuth,
    chatController.getPrivateMessages
  );
  chatRoutes.post("/new", requireAuth, chatController.newConversation);
  chatRoutes.post("/leave", requireAuth, chatController.leaveConversation);
  chatRoutes.post("/reply", requireAuth, chatController.sendReply);
  chatRoutes.get(
    "/channel/:channelName",
    chatController.getChannelConversations
  );

  chatRoutes.get("/channels/list", requireAuth, chatController.getAllChannels);

  chatRoutes.post(
    "/postchannel/:channelName",
    requireAuth,
    chatController.postToChannel
  );

  apiRoutes.use("/user", userRoutes);
  userRoutes.get("/list", requireAuth, userController.getAllUsers);
  userRoutes.get("/getChannels", requireAuth, userController.getChannel);
  userRoutes.post("/addchannel", requireAuth, userController.addChannel);
  userRoutes.post("/removechannel", requireAuth, userController.removeChannel);

  app.use("/api", apiRoutes);
};
