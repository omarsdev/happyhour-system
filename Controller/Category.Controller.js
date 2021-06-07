const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

const { Category, Sub } = require("../model/Category");

//-----------------------------Category-----------------------------

exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.find();

  res.status(200).json({
    success: true,
    count: category.length,
    data: category,
  });
});

exports.createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body);
  res.status(201).json({
    success: true,
    data: category,
  });
});

//-----------------------------Sub-Classification-----------------------------

exports.getSub = asyncHandler(async (req, res, next) => {
  const sub = await Sub.find();
  res.status(200).json({
    success: true,
    count: sub.length,
    data: sub,
  });
});

exports.createSub = asyncHandler(async (req, res, next) => {
  const sub = await Sub.create(req.body);
  res.status(201).json({
    success: true,
    data: sub,
  });
});
