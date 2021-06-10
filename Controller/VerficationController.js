const fs = require("fs");
const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

const Gift = require("../model/Gift");

const {
  VerficationAds,
  VerficationGift,
  VerficationStore,
} = require("../model/Verfication");
const UserVerfication = require("../model/UserVerfication");
const Store = require("../model/Store");

exports.createVerficationCodeGift = asyncHandler(async (req, res, next) => {
  const giftid = req.params.giftid;
  const brnadid = req.params.brandid;
  const gift = await Gift.findById(giftid)
    .select("verficationCode brand")
    .populate("verficationCode");

  if (!gift) {
    return next(new ErrorResponse(`Gift not foud with id of ${giftid}`));
  }

  gift.verficationCode.forEach((element) => {
    if (element.user_ref.toString() === req.user.id.toString()) {
      return next(
        new ErrorResponse(
          `You Already Havve a verfication Code ${element.code}`,
          400
        )
      );
    }
  });

  let verfication, code;
  do {
    code = getRandomString(6);
    const verficationCode = await VerficationGift.find().where("code").in(code);
    if (verficationCode.length === 0) {
      verfication = false;
    } else {
      verfication = true;
    }
  } while (verfication);
  const creteNewVerfication = await VerficationGift.create({
    code,
    gift_ref: giftid,
    user_ref: req.user.id,
    brand_ref: gift.brand,
  });
  if (!creteNewVerfication) {
    return next(new ErrorResponse(`Ads not found with id of ${giftid}`));
  }

  const user = await UserVerfication.findByIdAndUpdate(req.user.id, {
    $push: { gift_user: creteNewVerfication._id },
  });
  if (!user) {
    await VerficationGift.findByIdAndDelete(creteNewVerfication._id);
    return next(
      new ErrorResponse(`Please try to create verficationcode again 1`, 400)
    );
  }
  const giftVerfication = await Gift.findByIdAndUpdate(giftid, {
    $push: { verficationCode: creteNewVerfication._id },
  });
  if (!giftVerfication) {
    await VerficationGift.findByIdAndDelete(creteNewVerfication._id);
    await UserVerfication.findByIdAndUpdate(req.user.id, {
      $pull: { gift_user: creteNewVerfication._id },
    });
    return next(
      new ErrorResponse(`Please try to create verficationcode again`, 400)
    );
  }

  res.status(200).json({
    success: true,
    data: creteNewVerfication,
  });
});

function getRandomString(length) {
  var randomChars = "abcdefghijklmnopqrstuvwsyz";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
}

exports.createVerficationCodeStore = asyncHandler(async (req, res, next) => {
  const storeid = req.params.storeid;
  const store = await Store.findById(storeid)
    .select("verficationCode")
    .populate("verficationCode");

  if (!store) {
    return next(new ErrorResponse(`Store not foud with id of ${storeid}`));
  }

  store.verficationCode.forEach((element) => {
    if (element.user_ref.toString() === req.user.id.toString()) {
      return next(
        new ErrorResponse(
          `You Already Havve a verfication Code ${element.code}`,
          400
        )
      );
    }
  });

  let verfication, code;
  do {
    code = getRandomCodeStore();
    const verficationCode = await VerficationStore.find()
      .where("code")
      .in(code);
    if (verficationCode.length === 0) {
      verfication = false;
    } else {
      verfication = true;
    }
  } while (verfication);
  const creteNewVerfication = await VerficationStore.create({
    code,
    store_ref: storeid,
    user_ref: req.user.id,
  });
  if (!creteNewVerfication) {
    return next(new ErrorResponse(`Store not found with id of ${storeid}`));
  }

  const user = await UserVerfication.findByIdAndUpdate(req.user.id, {
    $push: { store_user: creteNewVerfication._id },
  });
  if (!user) {
    await VerficationStore.findByIdAndDelete(creteNewVerfication._id);
    return next(
      new ErrorResponse(`Please try to create verfication code again 1`, 400)
    );
  }
  const storeVerfication = await Store.findByIdAndUpdate(storeid, {
    $push: { verficationCode: creteNewVerfication._id },
  });
  if (!storeVerfication) {
    await VerficationStore.findByIdAndDelete(creteNewVerfication._id);
    await UserVerfication.findByIdAndUpdate(req.user.id, {
      $pull: { store_user: creteNewVerfication._id },
    });
    return next(
      new ErrorResponse(`Please try to create verfication code again`, 400)
    );
  }

  res.status(200).json({
    success: true,
    data: creteNewVerfication,
  });
});
function getRandomCodeStore() {
  var randomChars = "abcdefghijklmnopqrstuvwsyz";
  var randomNumber = "1234567890";
  var result = "";
  for (var i = 0; i < 3; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
    result += randomNumber.charAt(
      Math.floor(Math.random() * randomNumber.length)
    );
  }
  return result;
}
