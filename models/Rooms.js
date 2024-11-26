const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    deletedAt: {
      type: Date, 
    },
  },
  {
    timestamps: true, 
  }
);

const Rooms = mongoose.model("Rooms", userSchema);

module.exports = Rooms;
