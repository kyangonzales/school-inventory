const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    barcode: {
      type: String,
    },
    brand: {
      type: String,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Rooms'
    },  
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Items = mongoose.model("Items", userSchema);

module.exports = Items;
