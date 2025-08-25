const Role = require("../models/Role");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const {
  createOne,
  updateOne,
  getAll,
  getOne,
} = require("../utils/Modelfactory/factory");

exports.createRoleMiddleware = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return next(new appError("please Pass role name", 400));
  }
  req.body = { name, createdBy: req.user._id };

  next();
});
exports.createRole = createOne(Role);

exports.updateRoleMiddleware = catchAsync(async (req, res, next) => {
  req.body.updatedBy = req.user._id;
  next();
});

exports.updateRole = updateOne(Role);

exports.getRole = catchAsync(async (req, res, next) => {
  let order = ["super-admin", "company-admin", "manager", "caller"];
  const role = await Role.find({});

  let allRoles = order.map((roleName) => role.find((r) => r.name === roleName));

  let index = allRoles?.findIndex((el) => el?.name == req.user?.role?.name);

  allRoles = allRoles.splice(index + 1);

  res.status(200).send({
    status: true,
    data: allRoles,
  });
});

exports.getOne = getOne(Role);
