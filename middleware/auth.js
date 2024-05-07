const jwt = require("jsonwebtoken");
const User = require("../models/user");
const catchAsyncErrors = require("./catchAsyncErrors");
const ErrorHandler = require("../util/errorHandler");
const {
  UNAUTHORIZED,
  UNAUTHORIZED_ROLE,
  NOT_FOUND,
} = require("../util/httpStatusCodes");
const { permissionRef } = require("../config/roles");

// Check if the user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  let token;

  if (
    req?.cookies?.[`${process.env.JWT_BEARER_NAME}`]?.startsWith(
      process.env.JWT_BEARER
    )
  ) {
    token = req.cookies?.[`${process.env.JWT_BEARER_NAME}`].split(" ")[1];
  }

  if (!token) {
    return next(
      new ErrorHandler(
        "You must be logged in to access this feature",
        UNAUTHORIZED
      )
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new ErrorHandler("User does not exist", NOT_FOUND));
  }

  req.user = user;

  next();
});

// handling users roles
exports.authorizeRoles = (role) => {
  let allRoles = permissionRef[role];
  return (req, res, next) => {
    //If role is guest you can let through

    if (!allRoles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `You cannot access this resource, please contact your WP for more information`,
          UNAUTHORIZED_ROLE
        )
      );
    }

    next();
  };
};
