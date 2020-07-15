const mongoose = require("mongoose");
const { schema } = require("./user");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    body: {
      type: String,
    },
    author: [
      {
        kind: String,
        item: {
          type: String,
          refPath: "author.kind",
        },
      },
    ],
    channelName: {
      type: String,
    },
    guestPost: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("messages", MessageSchema);
