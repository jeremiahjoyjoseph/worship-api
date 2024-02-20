const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/users");
const ErrorHandler = require("../util/errorHandler");
const sendToken = require("../util/jwtToken");
const {
  SUCCESS,
  BAD_REQUEST,
  UNAUTHORIZED,
} = require("../util/httpStatusCodes");
const moment = require("moment");

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
  let body = req.body;

  //convert dob to date type
  if (body.dob) {
    body.dob = moment(body.dob, process.env.FE_DATE_FORMAT).format();
  }

  const user = await User.create({
    ...body,
  });

  sendToken(user, SUCCESS, res);
});

//Log out user
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("passage", "none", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "You have logged out successfully",
  });
});
