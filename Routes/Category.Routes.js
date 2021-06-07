const express = require("express");

const {
  getCategory,
  createCategory,
  createSub,
  getSub,
} = require("../Controller/Category.Controller");
const { protectEmployee, authorizeEmployee } = require("../middleware/auth");

const router = express.Router();

//-----------------------------Category-----------------------------
router
  .route("/")
  .get(getCategory)
  .post(protectEmployee, authorizeEmployee("admin"), createCategory);

//-----------------------------Sub-Classification-----------------------------
router.route("/sub/get").get(getSub);
router.route("/sub/create").post(createSub);

module.exports = router;
