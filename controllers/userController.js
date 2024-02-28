const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/user");
const Song = require("../models/song");
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

//Update password => /api/v1/user/update/password && /api/v1/user/update/password/:id
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  let userId = req.params.id || req.user.id;
  const user = await User.findById(userId).select("+password");

  // Check previous user password
  const isMatched = await user.comparePassword(req.body.currentPassword);
  if (!isMatched) {
    return next(new ErrorHandler("Old Password is incorrect.", UNAUTHORIZED));
  }

  user.password = req.body.newPassword;
  await user.save();

  if (req.params.id) {
    res.status(SUCCESS).json({
      success: true,
      message: "Password has been reset for the user specified",
      data: user,
    });
  } else {
    sendToken(
      user,
      SUCCESS,
      res,
      "Password has been reset, please re-login to continue"
    );
  }
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

//Update user data wp and above => /api/v1/user/update/data/:id
exports.updateUserData = catchAsyncErrors(async (req, res, next) => {
  let body = req.body;

  //convert dob to date type
  if (body.dob) {
    body.dob = moment(body.dob, process.env.FE_DATE_FORMAT).format();
  }

  user = await User.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });

  res.status(SUCCESS).json({
    success: true,
    message: "User updated",
    data: user,
  });
});

// Delete songs created by user
async function deleteUserData(user, role) {
  await Song.deleteMany({ createdBy: user });
}
