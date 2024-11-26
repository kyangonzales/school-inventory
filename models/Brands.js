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

const Brands = mongoose.model("Brands", userSchema);

module.exports = Brands;
