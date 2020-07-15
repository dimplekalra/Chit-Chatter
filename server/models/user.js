const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    messages: {
      type: String,
    },
    usersChannel: {
      type: Array,
      default: ["Public-Main"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", UserSchema);
