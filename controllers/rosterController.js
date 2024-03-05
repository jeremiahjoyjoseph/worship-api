const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Roster = require("../models/roster");
const user = require("../models/user");
const User = require("../models/user");

const {
  SUCCESS,
  BAD_REQUEST,
  UNAUTHORIZED,
} = require("../util/httpStatusCodes");

const moment = require("moment");

//Generate roster by selecting month  => /roster/generate
exports.generateRoster = catchAsyncErrors(async (req, res, next) => {
  let body = req.body;

  let users = await User.find();

  let submissions = [];
  users.forEach((user) => {
    if (user.status === "active") {
      submissions.push({
        userId: user._id,
        hasSubmittedDates: false,
        submittedDates: [],
      });
    }
  });
  body.submissions = submissions;

  let roster = await Roster.create({
    ...body,
  });

  res.status(SUCCESS).json({
    success: true,
    message: "Roster has been generated",
    data: roster,
  });
});

//Every individual submits their availability  => /roster/availability
exports.submitAvailability = catchAsyncErrors(async (req, res, next) => {
  let rosterId = req.params.rosterId;

  console.log(req, rosterId);

  res.status(SUCCESS).json({
    success: true,
    message: "Availability has been submitted, thank you for your service",
  });
});
