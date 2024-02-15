const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/users");
const Song = require("../models/songs");
const ErrorHandler = require("../util/errorHandler");
const {
  SUCCESS,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
} = require("../util/httpStatusCodes");
const sendToken = require("../util/jwtToken");
const APIFilters = require("../util/apiFilters");

//Get all users => /api/v1/user/all
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const apiFilters = new APIFilters(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  const users = await apiFilters.query;

  res.status(SUCCESS).json({
    success: true,
    data: users,
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

//delate any user => /api/v1/user/delete/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, NOT_FOUND)
    );
  }

  deleteUserData(user.id, user.role);
  await user.remove();

  res.status(SUCCESS).json({
    success: true,
    message: "This account has been deleted by your admin",
  });
});

//delate self account => /api/v1/user/delete
exports.deleteSelf = catchAsyncErrors(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id);

  deleteUserData(req.user.id, req.user.role);

  res.cookie("passage", "none", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(SUCCESS).json({
    success: true,
    message: "Your account has been deleted",
  });
});

// Delete songs created by user
async function deleteUserData(user, role) {
  await Song.deleteMany({ createdBy: user });
}
