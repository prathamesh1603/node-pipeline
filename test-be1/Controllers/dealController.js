const Deal = require("../models/Deal");
const catchAsync = require("../utils/catchAsync");
const { getAll, getOne, updateOne } = require("../utils/Modelfactory/factory");

// Get all deals
exports.getAllDeal = getAll(Deal);

exports.updateDealMiddleware = catchAsync(async (req, res, next) => {
  const { textMessageAboutActivity, currentStatus, description, probability } =
    req.body;

  if (currentStatus.dealWon) {
    req.body = {
      textMessageAboutActivity: textMessageAboutActivity,
      description,
      probability,
      currentStatus: currentStatus,
      lastActivityDate: new Date().toGMTString(),
      lastUpdationBy: req.user._id,
      dealWonOn: Date.now(),
      editable: false,
    };
  } else if (currentStatus.dealLost) {
    req.body = {
      textMessageAboutActivity: textMessageAboutActivity,
      description,
      probability,
      currentStatus: currentStatus,
      lastActivityDate: new Date().toGMTString(),
      lastUpdationBy: req.user._id,
      dealLostOn: Date.now(),
      editable: false,
    };
  } else {
    req.body = {
      textMessageAboutActivity: textMessageAboutActivity,
      description,
      probability,
      currentStatus: currentStatus,
      lastActivityDate: new Date().toGMTString(),
      lastUpdationBy: req.user._id,
    };
  }

  next();
});

exports.getDeal = getOne(Deal);
exports.updateDeal = updateOne(Deal);
