const express = require("express");

const { protect, authorize, protectEmployee } = require("../middleware/auth");

const {
  getAllGifts,
  createNewBrandGift,
  getAllGift,
} = require("../Controller/Gift.Controller");

const router = express.Router();

router.route("/").get(protect, getAllGifts);
router
  .route("/:brandid")
  .get(protect, getAllGift)
  .post(protect, authorize("client"), createNewBrandGift);

module.exports = router;
