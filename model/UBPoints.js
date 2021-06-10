const mongoose = require("mongoose");

const UserBrandPointsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
  },
  brand_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
  },
  points: {
    type: Number,
  },
  cards: {
    type: Number,
  },
  logs: [
    {
      desc: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const UBPoints = mongoose.model("UBPoints", UserBrandPointsSchema);
module.exports = {
  UBPoints,
};
