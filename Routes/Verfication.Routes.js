const express = require("express");

const { protect, authorize, protectEmployee } = require("../middleware/auth");

const {
  createVerficationCodeGift,
  createVerficationCodeStore,
} = require("../Controller/VerficationController");

const router = express.Router();

router
  .route("/gift/:giftid")
  .post(protect, authorize("client"), createVerficationCodeGift);
router
  .route("/store/:storeid")
  .post(protect, authorize("client"), createVerficationCodeStore);

module.exports = router;
