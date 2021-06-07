const express = require("express");

const { protect, authorize, protectEmployee } = require("../middleware/auth");

const {
  createVerficationCodeGift,
} = require("../Controller/VerficationController");

const router = express.Router();

router.route("/gift/:giftid").post(protect, createVerficationCodeGift);

module.exports = router;
