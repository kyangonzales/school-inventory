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
      type: mongoose.Schema.Types.ObjectId,
      ref:'Brands'
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Rooms'
    },
    quantity: {
      type: Number,
    },
    status: {
      type: String,
    },
    condition: {
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

const Items = mongoose.model("Items", userSchema);

module.exports = Items;
