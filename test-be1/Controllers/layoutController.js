const Layout = require("../models/Layout");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const {
  createOne,
  updateOne,
  getOne,
  getAll,
} = require("../utils/Modelfactory/factory");

exports.createLayoutMiddleware = catchAsync(async (req, res, next) => {
  if (!req.body.ofCompany && !req?.user?.ofCompany) {
    return next(new appError("please pass organization details", 400));
  }
  req.body.createdBy = req.user._id;
  req.body.ofCompany = req?.user?.ofCompany?._id || req?.body.ofCompany;

  next();
});
exports.createLayout = createOne(Layout);
exports.updateLayoutMiddleware = catchAsync(async (req, res, next) => {
  req.body.updatedBy = req.user._id;

  next();
});
exports.updateLayout = updateOne(Layout);
exports.getOneLayout = getOne(Layout);
exports.getAllLayout = getAll(Layout);
