const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/User");

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req?.cookies?.jwt) {
    // allowing the access to the protected route if we have jwt cookie
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new appError("please login to get access", 401));
  }

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decode.id)
    .populate({
      path: "role",
      // select: "name permissions", // Fields for role
    })
    .populate({
      path: "ofCompany",
      select:
        "name status ozonetelApiKey ozonetelUsername ozonetelcampaignName ", // Fields for ofCompany
    });

  if (!freshUser) {
    return next(new appError("the user do  not exist ", 401));
  }
  if (
    freshUser?.role?.name !== "super-admin" &&
    freshUser?.ofCompany?.status == "inactive"
  ) {
    return next(
      new appError(
        "Your organization is inactive please contact super admin",
        400
      )
    );
  }
  if (freshUser.status == "inactive") {
    return next(
      new appError("Your status is inactive please contact your admin", 400)
    );
  }

  if (await freshUser.changedPasswords(decode.iat)) {
    return next(new appError("password is changed need to login again", 401));
  }

  // future use
  req.user = freshUser;

  next();
});
