const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Roster = require("../models/roster");
const user = require("../models/user");
const User = require("../models/user");
const ErrorHandler = require("../util/errorHandler");

const {
  SUCCESS,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
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

//Every individual submits their availability  => /roster/availability/:id
exports.submitAvailability = catchAsyncErrors(async (req, res, next) => {
  //lets get the roster first
  let roster = await Roster.findById(req.params.id);
  if (!roster) {
    return next(new ErrorHandler("Roster not found", NOT_FOUND));
  }

  //find out if user has already given dates,
  //if not lets record dates submitted
  let userSubmission = roster.submissions.find(
    (submission) => submission.userId === req.user.id
  );
  if (userSubmission.hasSubmittedDates) {
    return next(
      new ErrorHandler(
        "User has already submitted dates for this roster",
        BAD_REQUEST
      )
    );
  } else {
    userSubmission.hasSubmittedDates = true;
    userSubmission.submittedDates = req.body.submittedDates;
  }

  //let us update the roster submission document of that user
  let submissionToUpdate = roster.submissions.findIndex(
    (submission) => submission.userId === req.user.id
  );
  roster.submissions[submissionToUpdate] = userSubmission;

  let newRoster = await Roster.findByIdAndUpdate(req.params.id, roster, {
    new: true,
    runValidators: true,
  });

  res.status(SUCCESS).json({
    success: true,
    message: "Availability has been submitted, thank you for your service",
    data: newRoster,
  });
});
