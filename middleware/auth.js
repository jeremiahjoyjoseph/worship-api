const jwt = require("jsonwebtoken");
const User = require("../models/users");
const catchAsyncErrors = require("./catchAsyncErrors");
const ErrorHandler = require("../util/errorHandler");
const { UNAUTHORIZED, UNAUTHORIZED_ROLE } = require("../util/httpStatusCodes");
const roles = require("../util/roles");

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
  req.user = await User.findById(decoded.id);

  next();
});

// handling users roles
exports.authorizeRoles = (role) => {
  let allRoles = roles[role];
  return (req, res, next) => {
    //If role is guest you can let through

    if (!allRoles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource.`,
          UNAUTHORIZED_ROLE
        )
      );
    }

    next();
  };
};