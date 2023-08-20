const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/users");
const ErrorHandler = require("../util/errorHandler");
const {
  SUCCESS,
  BAD_REQUEST,
  UNAUTHORIZED,
} = require("../util/httpStatusCodes");

//Register new user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, password, role, username } = req.body;
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
    username,
  });

  //Create JWT Token
  const token = user.getJwtToken();

  res.status(SUCCESS).json({
    success: true,
    message: "User has been registered.",
    token,
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
  const token = user.getJwtToken();

  res.status(SUCCESS).json({
    success: true,
    message: "User is logged in.",
    token,
  });
});
