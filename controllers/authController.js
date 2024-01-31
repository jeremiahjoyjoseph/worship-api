const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/users");
const ErrorHandler = require("../util/errorHandler");
const sendToken = require("../util/jwtToken");
const {
  SUCCESS,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
} = require("../util/httpStatusCodes");

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

//Register new user => /api/v1/register
exports.updateUsername = catchAsyncErrors(async (req, res, next) => {
  let user = await User.findOne({ username: req.body.oldUsername });

  if (!user) {
    return next(new ErrorHandler("User not found", NOT_FOUND));
  }

  user = await User.findByIdAndUpdate(user.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(SUCCESS).json({
    success: true,
    message: "User details have been updated",
    data: user,
  });
});

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
