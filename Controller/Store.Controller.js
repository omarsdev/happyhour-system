const fs = require("fs");
const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Brand = require("../model/Brand");
const { Client } = require("../model/Client");
const Store = require("../model/Store");

exports.createNewStore = asyncHandler(async (req, res, next) => {
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a photo`, 400));
  }
  const description = req.body.description;
  if (!description) {
    return next(new ErrorResponse(`Please add a description`, 400));
  }
  const photo = req.files.photo;

  const client = await Client.findById(req.user._id).select("brand");
  if (!client) {
    return next(new ErrorResponse(`Client not found`, 404));
  }

  var founded = false;
  let brand = client.brand;
  for (let i = 0; i < brand.length; i++) {
    if (brand[i].toString() === req.params.brandid.toString()) {
      founded = true;
    }
  }
  if (!founded) {
    return next(new ErrorResponse(`Brand not found`, 404));
  }

  // Make sure the image is a photo
  if (!photo.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (photo.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  const store = await Store.create({ description });

  // Create custom filename
  photo.name = `photo_${store._id}${path.parse(photo.name).ext}`;

  const dir = store._id.toString();
  const storepath = `${process.env.FILE_UPLOAD_PATH_CLIENT}/${req.user._id}/${req.params.brandid}/store`;
  const finallPath = storepath.concat("/", dir);

  if (!fs.existsSync(finallPath)) {
    fs.mkdirSync(finallPath);
  }

  photo.mv(`${finallPath}/${photo.name}`, async (err) => {
    if (err) {
      console.error(err);
      await Store.findByIdAndDelete(store._id);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    await store.updateOne({ photo: photo.name });
    const brand = await Brand.findByIdAndUpdate(req.params.brandid, {
      $push: {
        storeid: store._id,
      },
    });

    if (!brand) {
      await Store.findByIdAndDelete(store._id);
      return next(new ErrorResponse(`Please tyy Again`, 500));
    }

    res.status(200).json({
      success: true,
      store,
    });
  });
});

//get All Store for this brand
exports.getAllStore = asyncHandler(async (req, res, next) => {
  const brandStore = await Brand.findById(req.params.brandid)
    .populate("storeid")
    .select("storeid");

  if (!brandStore) {
    return next(
      new ErrorResponse(`brand not found with id of ${req.params.brandid}`)
    );
  }

  res.json({
    success: true,
    count: brandStore.storeid.length,
    data: brandStore.storeid,
  });
});

exports.createStore = asyncHandler(async (req, res, next) => {
  //check if he was a client
  const brand = await Brand.findById(req.params.brandid)
    .where("clientid")
    .in(req.user._id);

  if (!brand) {
    return next(new ErrorResponse(`Brand not found`, 404));
  }

  //take data as files

  const { description, photo } = req.body;

  // console.log(photo.length);

  photo.forEach((element) => {
    console.log(element.type);
    console.log(element.color);
  });

  res.status(200).json({
    success: true,
    data: brand,
  });
});

exports.checkStoreTest = asyncHandler(async (req, res, next) => {
  // const brand = await Brand.findById(req.params.brandid)
  //   .where("clientid")
  //   .in(req.user._id);

  // if (!brand) {
  //   return next(new ErrorResponse(`Brand not found`, 404));
  // }
  // const { description, color } = req.body;
  // console.log("Description is : ", description, "\nColor is : ", color);

  // color.forEach((e) => {
  //   console.log("type of color", e.type);
  // });

  // const store = await Store.create(req.body);

  console.log(req.files.photo);
  console.log(req.body);
  const { color, size } = req.body;

  let size1 = JSON.parse(size);
  size = size1;

  // let photo = [];

  // color.forEach((element) => {
  // console.log("type : ", element.type);
  // console.log("photo : ", element.photo.photoarray);
  // photo = element.photo.photoarray;
  // console.log("size : ", element.photo.size);
  // });

  // photo._parts.forEach((element) => {
  //   console.log(element);
  // });

  res.status(200).json({
    success: true,
    // data: store,
  });
});
