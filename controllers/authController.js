const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/users");
const { SUCCESS } = require("../util/httpStatusCodes");

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
    message: "User has been registered",
    token,
  });
});
