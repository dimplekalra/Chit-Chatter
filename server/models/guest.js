const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GuestSchema = new Schema(
  {
    guestName: {
      type: String,
      required: true,
      unique: true,
    },
    messages: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("guests", GuestSchema);
