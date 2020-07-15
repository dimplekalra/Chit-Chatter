const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  channelName: {
    type: String,
  },
});

module.exports = mongoose.model("conversations", ConversationSchema);
