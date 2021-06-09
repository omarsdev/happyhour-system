const mongoose = require("mongoose");

const CasherSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brnad",
  },
  branchId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branche",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Casher", CasherSchema);
