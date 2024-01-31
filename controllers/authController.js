const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/users");
const ErrorHandler = require("../util/errorHandler");
const sendToken = require("../util/jwtToken");
const {
  SUCCESS,
  BAD_REQUEST,
  UNAUTHORIZED,
} = require("../util/httpStatusCodes");
const bcrypt = require("bcryptjs");

//Login user => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //Checks if email or password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", BAD_REQUEST));
  }

  //Finding user in database
  const user = await User.findOne({ email }).select("+password");
  const userEmail = await User.findOne({ email });
  const userPassword = await User.findOne().select("+password");

  if (!userEmail) {
    return next(new ErrorHandler("Invalid email", UNAUTHORIZED));
  }

  if (!userPassword) {
    return next(new ErrorHandler("Invalid password", UNAUTHORIZED));
  }

  //Check if password is correct
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid password", UNAUTHORIZED));
  }

  //Create JSON web token
  sendToken(user, SUCCESS, res);
});

//Register new user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    middleName,
    lastName,
    email,
    password,
    role,
    username,
    phNo,
  } = req.body;

  const user = await User.create({
    firstName,
    middleName,
    lastName,
    email,
    password,
    role,
    username,
    phNo,
  });

  sendToken(user, SUCCESS, res);
});

//Update username
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

//Update password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (oldPassword === newPassword) {
    return next(new ErrorHandler("Why are they the same?", BAD_REQUEST));
  }

  //Checks if email or password is entered by user
  if (!oldPassword || !newPassword) {
    return next(
      new ErrorHandler("Please provide required fields", BAD_REQUEST)
    );
  }

  //Check if password is correct
  const isPasswordMatched = await req.user.comparePassword(oldPassword);

  //Check if existing and provided old password matches
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", UNAUTHORIZED));
  }

  //encrypt the new password
  const encryptNewPassword = await bcrypt.hash(newPassword, 10);

  //update password
  const newUser = await User.findByIdAndUpdate(
    req.user.id,
    { password: encryptNewPassword },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(SUCCESS).json({
    success: true,
    message: "Password updated",
    data: newUser,
  });
});

//Update role
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
    req.user.id,
    { role: role },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(SUCCESS).json({
    success: true,
    message: "Role updated",
    data: user,
  });
});
