// const socket = require("socket.io");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("user has joined");

    console.log(socket.id);

    socket.on("enter channel", (channel, username) => {
      if (username) {
        socket.join(channel);

        io.sockets
          .in(channel)
          .emit("user joined", `${username} has joined the ${channel}`);
        console.log("user has joined the channel ", channel, username);
      } else return false;
    });

    socket.on("leave channel", (channel, username) => {
      socket.leave(channel);

      io.sockets
        .in(channel)
        .emit("user left", `${username} has left the ${channel}`);
      console.log("user has left the channel ", username, channel);
    });

    socket.on("new message", (msg) => {
      console.log(msg);
      io.sockets.in(msg.channel).emit("refresh messages", msg);
      console.log("new message is received ", msg);
    });

    socket.on("enter privateMessage", (conversationId) => {
      socket.join(conversationId);
    });

    socket.on("leave privateMessage", (conversationId) => {
      socket.join(conversationId);
    });

    socket.on("new privateMessage", (msg) => {
      io.sockets.in(msg.conversationId).emit("refresh privateMessages", msg);
    });

    socket.on("user typing", (data) => {
      io.sockets.in(data.conversationId).emit("typing", data);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
