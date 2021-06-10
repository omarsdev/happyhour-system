const fs = require("fs");
const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

const Gift = require("../model/Gift");
const Client = require("../model/Client");
const { Brand } = require("../model/Brand");
const { VerficationGift } = require("../model/Verfication");
const User = require("../model/User");

exports.getAllGifts = asyncHandler(async (req, res, next) => {
  //TODO Rate User
  const gifts = await Gift.find().populate({
    path: "brand",
    select: "name_en name_ar logo categoryid",
    populate: {
      path: "categoryid",
      select: "name_en name_ar",
    },
  });

  res.status(200).json({
    success: true,
    data: gifts,
  });
});

exports.getAllGift = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.brandid)
    .select("name_en name_ar logo categoryid gift")
    .populate({
      path: "categoryid",
      select: "name_en name_ar",
    })
    .populate({
      path: "gift",
      select: "-brand",
    })
    .exec(function (err, element) {
      let giftArr = [];
      element.gift.forEach((gift) => {
        gift = JSON.parse(JSON.stringify(gift));
        gift["brand"] = {};
        gift["brand"]["logo"] = element.logo;
        gift["brand"]["_id"] = element._id;
        gift["brand"]["name_en"] = element.name_en;
        gift["brand"]["name_ar"] = element.name_ar;
        gift["brand"]["categoryid"] = element.categoryid;
        giftArr.push(gift);
      });
      res.json({
        success: true,
        data: giftArr,
      });
    });

  if (!brand) {
    return next(
      new ErrorResponse(`Brnad Not Found with id of ${req.params.brandid}`)
    );
  }
});

exports.createNewBrandGift = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.brandid)
    .where("clientid")
    .in(req.user._id);
  if (!brand) {
    return next(new ErrorResponse(`Not autherize to access this brand`, 401));
  }
  //TODO handle is there any photo

  let photo = req.files.photo;
  if (!photo) {
    return next(new ErrorResponse(`Please Upload Your Photo`, 400));
  }

  //TODO Body in req.body
  // const {
  //   model_number,
  //   description,
  //   price_in_points,
  //   price_on_card,
  //   quantity,
  // } = req.body;

  const body = JSON.parse(req.files.text.data);
  const {
    model_number,
    description,
    price_in_points,
    price_on_card,
    quantity,
    giftTeamplate,
  } = body;

  const gift = await Gift.create({
    model_number,
    description,
    price_in_points,
    price_on_card,
    quantity,
    giftTeamplate,
    brand: req.params.brandid,
  });

  //cretae folder in gift
  console.log(gift);
  const dir = gift._id.toString();
  const giftPath = `${process.env.FILE_UPLOAD_PATH_CLIENT}/${req.user._id}/${req.params.brandid}/gift`;
  const finallPath = giftPath.concat("/", dir);

  if (!fs.existsSync(finallPath)) {
    fs.mkdirSync(finallPath);
  }

  //Make Sure that the photo is actuly Image
  if (!photo.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }
  //Create Custome Gift name
  photo.name = `giftPhoto-${gift._id}-1${path.parse(photo.name).ext}`;

  //Move Phot to gift Folder
  photo.mv(`${finallPath}/${photo.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    const newImage = `${process.env.URL_PATH}/${req.user._id}/${req.params.brandid}/gift/${gift._id}/${photo.name}`;
    console.log(newImage);
    await Gift.findByIdAndUpdate(gift._id, {
      photo: newImage,
    });
  });

  //Update Brand To Add New Gift
  const UpdateBrand = await Brand.findByIdAndUpdate(req.params.brandid, {
    $push: { gift: gift._id },
  });
  console.log(UpdateBrand);

  res.status(201).json({
    success: true,
    data: gift,
  });
});

exports.updategift = asyncHandler(async (req, res, next) => {});

// ------------------------------------------------------------ Cacher ------------------------------------------------------------
exports.checkGiftCode = asyncHandler(async (req, res, next) => {
  // const gift = await VerficationGift.find({ code: req.body.code });
  // if (!gift) {
  //   return next(new ErrorResponse(`Code Not Found`));
  // }
  // if (gift.expire) {
  //   res.status(200).json({
  //     success: true,
  //     msg: "this gift is already used",
  //     data: gift,
  //   });
  // }
  // res.status(200).json({
  //   success: true,
  //   data: gift,
  // });
});

exports.confirmGiftCode = asyncHandler(async (req, res, next) => {
  const gift = await VerficationGift.find({ code: req.body.code })
    .populate({
      path: "gift_ref",
      select: "-verficationCode",
    })
    .populate({
      path: "user_ref",
      select: "username gender birthday ",
    });
  if (!gift) {
    return next(new ErrorResponse(`Code Not Found`));
  }
  res.status(200).json({
    success: true,
    data: gift,
  });
});

// ------------------------------------------------------------ Cacher ------------------------------------------------------------
//TODO get user gift
