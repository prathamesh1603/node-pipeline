const User = require("../models/User");

const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const {
  createOne,
  getAll,
  updateOne,
  getOne,
} = require("../utils/Modelfactory/factory");
const jwt = require("jsonwebtoken");
const Company = require("../models/Company");
const Role = require("../models/Role");
const createTokenSendRes = (id, res, statusCode, data) => {
  let token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRIR_IN,
  });

  let cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),

    // secure: true,
    httpOnly: true,
    // sameSite: "None",
    path: "/",
  };
  if (process.env.NODE_ENV == "production") {
    cookieOptions.secure = true;
  }
  res.cookie("jwt", token, cookieOptions);

  // we will set cookies
  res.status(statusCode).json({
    status: true,
    data,
    token,
  });
};
exports.createUserMiddleware = catchAsync(async (req, res, next) => {
  next();
});
exports.createUser = catchAsync(async (req, res, next) => {
  let {
    name,
    email,
    mobile,
    address,
    ofCompany,
    role,
    status,
    agentId,
    campaignName,
    employeeCode,
  } = req.body;
  if (!ofCompany) {
    ofCompany = req?.user?.ofCompany;
  }

  if (!name || !email || !mobile || !ofCompany || !status || !role) {
    return next(new appError("Please provide entire details", 400));
  }
  let pass = Date.now().toString(36); // Convert to base 36
  const roleData = await Role.findById(role);
  if (!roleData?.name) {
    return next(new appError("Not a valid ", 400));
  }

  const doc = await User.create({
    name,
    email,
    mobile,
    address,
    ofCompany,
    role: roleData._id,
    // password: pass,
    password: 123456,
    status,
    agentId,
    campaignName,
    createdBy: req.user._id,
    employeeCode,
  });
  if (!doc) {
    return next(
      new appError("failed to create doc please try again to create !!", 404)
    );
  }
  if (roleData.name == "company-admin") {
    await Company.findByIdAndUpdate(ofCompany, {
      assignedTo: doc._id,
    });
  } else if (roleData.name == "caller") {
    if (status == "active") {
      await Company.findByIdAndUpdate(ofCompany, {
        $push: {
          caller: doc._id,
          activeCaller: doc._id,
        },
      });
    } else {
      await Company.findByIdAndUpdate(ofCompany, {
        $push: { caller: doc._id },
      });
    }
  }

  res.status(200).send({
    status: true,
    msg: "user created ",
  });
});

exports.getAllUser = getAll(User);
exports.getOneUser = getAll(User);

exports.resetPasswordMiddleware = catchAsync(async (req, res, next) => {
  if (req.user.autoGenratedPassword) {
    const { password } = req.body;
    req.body = { password };
    next();
  } else {
    next();
  }
});

exports.changePasswordMiddleware = catchAsync(async (req, res, next) => {
  const { oldPassword } = req.body;
  if (!oldPassword) {
    return next(new appError("please pass old password", 400));
  }
  let user = await User.findById(req.user._id).select("password");

  if (await user.correctPass(oldPassword, user.password)) {
    const { password } = req.body;
    req.body = { password };
    next();
  } else {
    return next(
      new appError(" input password do not match old password ", 400)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const password = req.body.password;

  if (!password) {
    return next(new appError("please enter password to be set", 400));
  }

  let user = await User.findById(req.user._id);

  if (!user) {
    return next(
      new appError(
        "please ensure are you requesting the reset password operation , you are not our member",
        400
      )
    );
  }

  user.password = password;
  user.autoGenratedPassword = false;
  (user.passwordChangedAt = Date.now()), (user.passwordResetOTP = undefined);
  user.passwordExpires = undefined;

  await user.save();

  createTokenSendRes(user._id, res, 200, "your password is changed");
});

exports.updateUserMiddleware = catchAsync(async (req, res, next) => {
  const {
    status,
    mobile,
    address,
    name,
    role,
    email,
    agentId,
    campaignName,
    employeeCode,
  } = req.body;

  req.body = {
    status,
    mobile,
    address,
    name,
    role,
    email,
    agentId,
    campaignName,
    createdBy: req.user._id,
    employeeCode,
  };

  next();
});

exports.updateUser = updateOne(User);

exports.getUserById = getOne(User);
