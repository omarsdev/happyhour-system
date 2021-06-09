const fs = require("fs");
const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

const { Brand, Branche } = require("../model/Brand");
const User = require("../model/User");
const Casher = require("../model/Casher");
const { Client } = require("../model/Client");

//get caher for brand
exports.getCashersBrand = asyncHandler(async (req, res, next) => {
  const casher = await Brand.findById(req.params.brandid)
    .select("branche")
    .populate({
      path: "branche",
      select: "casher",
    });

  res.json({
    success: true,
    data: casher,
  });
});

exports.setCahserForBrache = asyncHandler(async (req, res, next) => {
  //check if brandid and verficationcode is exists
  const checkBrand = await Branche.findById(req.params.branchid)
    .select("brand_ref")
    .where("_id")
    .in(req.params.branchid)
    .where("brand_ref")
    .in(req.params.brandid);

  if (!checkBrand) {
    return next(new ErrorResponse(`brnad or branceh not found`, 400));
  }

  const user = await User.find({ phone_number: req.body.phone_number }).select(
    "username role"
  );

  if (user.length === 0) {
    return next(new ErrorResponse(`user not found`));
  }

  //TODO if user is already casher
  if (user[0].role !== "user") {
    return next(new ErrorResponse(`This user cannot be casher`, 400));
  }

  //1 - update user role
  const updateUser = await User.findByIdAndUpdate(user[0]._id, {
    role: "casher",
  });
  if (!updateUser) {
    return next(new ErrorResponse(`Please try Again`, 400));
  }
  var addCasher = await Casher.create({
    _id: user[0]._id,
    brandId: req.params.brandid,
    branchId: req.params.branchid,
  });
  if (!addCasher) {
    await User.findByIdAndUpdate(user[0]._id, {
      role: "user",
    });
    return next(new ErrorResponse(`Please try Again`, 400));
  }

  //3 - update branche schema to add the new casher
  const addCasherBranche = await Branche.findByIdAndUpdate(
    req.params.branchid,
    {
      $push: { caher: user[0]._id },
    }
  );
  if (!addCasherBranche) {
    await User.findByIdAndUpdate(user[0]._id, {
      role: "user",
    });
    await Casher.findByIdAndDelete(user[0]._id);
    return next(new ErrorResponse(`Please try Again`, 400));
  }
  //4 -
  res.status(201).json({
    success: true,
  });
  //TODO if user is not casher
});

//get casher for branche
