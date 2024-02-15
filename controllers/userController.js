const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/users");
const ErrorHandler = require("../util/errorHandler");
const {
  SUCCESS,
  BAD_REQUEST,
  UNAUTHORIZED,
} = require("../util/httpStatusCodes");
const sendToken = require("../util/jwtToken");

//Get all users => /api/v1/user/all
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  let user = await User.find();

  res.status(SUCCESS).json({
    success: true,
    data: user,
  });
});

//GetUserProfile => /api/v1/user/data
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  let user = await User.findById(req.user.id);

  res.status(SUCCESS).json({
    success: true,
    data: user,
  });
});

//Update username => /api/v1/user/update/username
exports.updateUsername = catchAsyncErrors(async (req, res, next) => {
  const { username } = req.body;

  if (!username) {
    return next(new ErrorHandler("Please provide new username", BAD_REQUEST));
  }

  user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(SUCCESS).json({
    success: true,
    message: "Username updated",
    data: user,
  });
});

//Update password => /api/v1/user/update/password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  // Check previous user password
  const isMatched = await user.comparePassword(req.body.currentPassword);
  if (!isMatched) {
    return next(new ErrorHandler("Old Password is incorrect.", UNAUTHORIZED));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, SUCCESS, res);
});

//Update role => /api/v1/user/update/role
exports.updateRole = catchAsyncErrors(async (req, res, next) => {
  const { id, role } = req.body;

  if (!id || !role) {
    return next(
      new ErrorHandler("Please provide required details", BAD_REQUEST)
    );
  }

  let user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("User not found", NOT_FOUND));
  }

  user = await User.findByIdAndUpdate(
    id,
    { role: role },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(SUCCESS).json({
    success: true,
    message: "Role updated",
    data: user,
  });
});

//delate user => /api/v1/user/delete
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  await User.findOneAndDelete({ username: req.body.username });

  res.cookie("passage", "none", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(SUCCESS).json({
    success: true,
    message: "This account has been deleted",
  });
});
