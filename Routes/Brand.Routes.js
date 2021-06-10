const express = require("express");

//import autherizetion
const { protect, authorize, protectEmployee } = require("../middleware/auth");

const {
  createBranche,
  createBrand,
  getBranches,
  getBrand,
  getBrands,
  updateBranches,
  getBrandByEmloyee,

  uploadCoverPhoto,
  uploadLogoPhoto,

  searchBrand,
  getBrandByID,
  getSmallInfo,
} = require("../Controller/Brand.Controller");

const {
  getCashersBrand,
  setCahserForBrache,
  getCahserBranche,
} = require("../Controller/Casher.Controller");

const router = express.Router();

//-----------------------------Brand-----------------------------
router
  .route("/")
  .get(protect, authorize("client"), getBrand)
  .post(protect, authorize("client"), createBrand);
router.route("/all").get(getBrands);
router.route("/search").get(searchBrand);
router.route("/:id").get(protect, getBrandByID);
router.route("/small/:id").get(getSmallInfo);
router.route("/cover/:id").put(protect, authorize("client"), uploadCoverPhoto);
router.route("/logo/:id").put(protect, authorize("client"), uploadLogoPhoto);
router.route("/:client").get(protectEmployee, getBrandByEmloyee);

//-----------------------------Branches-----------------------------
router
  .route("/branche/:brandid")
  .get(getBranches)
  .post(protect, authorize("client"), createBranche);
router
  .route("/branche/:brandid/:id")
  .put(protect, authorize("client"), updateBranches);

router.route("/branche/casher/:branchid").get(getCahserBranche);
router.route("/branche/casher/:brandid/:branchid").get(getCashersBrand);
router.route("/branche/casher/:brandid/:branchid").post(setCahserForBrache);
module.exports = router;
