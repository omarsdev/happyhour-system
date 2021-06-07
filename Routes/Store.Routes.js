const express = require("express");

//import autherizetion
const { protect, authorize, protectEmployee } = require("../middleware/auth");

const {
  createNewStore,
  getAllStore,
  createStore,
  checkStoreTest,
} = require("../Controller/Store.Controller");

const router = express.Router();

router
  .route("/:brandid")
  .get(getAllStore)
  // .post(protect, authorize("client"), createStore);
  .post(protect, authorize("client"), checkStoreTest);

// router.route("/").post(checkStoreTest)

module.exports = router;
