const mongoose = require("mongoose");

const VerficationAdsSchema = new mongoose.Schema({
  offer_ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ads",
  },
  user_ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  code: {
    type: String,
    required: true,
  },
  expire: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  used_at: {
    type: Date,
  },
});
const VerficationAds = mongoose.model("Verfication", VerficationAdsSchema);

const VerficationStoreSchema = new mongoose.Schema({
  store_ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
  },
  user_ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  code: {
    type: String,
    required: true,
  },
  expire: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  used_at: {
    type: Date,
  },
});

const VerficationStore = mongoose.model(
  "VerficationStore",
  VerficationStoreSchema
);

const VerficationGiftSchema = new mongoose.Schema({
  gift_ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gift",
  },
  user_ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  code: {
    type: String,
    required: true,
  },
  expire: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  used_at: {
    type: Date,
  },
});

const VerficationGift = mongoose.model(
  "VerficationGift",
  VerficationGiftSchema
);

module.exports = {
  VerficationAds,
  VerficationGift,
  VerficationStore,
};
