const express = require("express");

const { protect, authorize, protectEmployee } = require("../middleware/auth");

const {
  getAllGifts,
  createNewBrandGift,
  getAllGift,
  //chacher
  checkGiftCode,
  confirmGiftCode,
} = require("../Controller/Gift.Controller");

const router = express.Router();

router.route("/").get(protect, getAllGifts);
//cacher
router.route("/check").get(protect, checkGiftCode).post(confirmGiftCode);
router
  .route("/:brandid")
  // .get(protect, checkGiftCode)
  .get(protect, getAllGift)
  .post(protect, authorize("client"), createNewBrandGift);

module.exports = router;
