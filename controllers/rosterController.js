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
  INTERNAL_SERVER_ERROR,
} = require("../util/httpStatusCodes");

const moment = require("moment");

//Generate roster by selecting month  => /roster/generate
exports.generateRoster = catchAsyncErrors(async (req, res, next) => {
  let body = req.body;

  //retrieve all users and create slots in roster.submissions
  let users = await User.find();
  let datesGiven = [];
  users.forEach((user) => {
    if (user.status === "active") {
      datesGiven.push({
        userId: user._id,
        userData: user,
        hasSubmittedDates: false,
        submittedDates: [],
      });
    }
  });
  body.datesGiven = datesGiven;

  //create roster
  let roster = await Roster.create({
    ...body,
  });

  res.status(SUCCESS).json({
    success: true,
    message: "Roster has been generated",
    data: roster,
  });
});

//Every individual submits their availability  => /roster/availability/:rosterId/:userId
exports.submitAvailability = catchAsyncErrors(async (req, res, next) => {
  if (!req.params.rosterId) {
    return next(
      new ErrorHandler(
        "Link is corrupted, please ask WP for a new link",
        NOT_FOUND
      )
    );
  }

  //lets get the roster first
  let roster = await Roster.findById(req.params.rosterId);
  if (!roster) {
    return next(new ErrorHandler("Roster not found", NOT_FOUND));
  }

  let userSubmission = {};
  userSubmission.hasGivenDates = true;
  userSubmission.givenDates = req.body.submittedDates;

  //let us update the roster submission document of that user
  let userToUpdate = roster.datesGiven.findIndex(
    (x) => x.userId === req.params.userId
  );
  roster.datesGiven[userToUpdate] = {
    ...roster.datesGiven[userToUpdate],
    ...userSubmission,
  };

  await Roster.findByIdAndUpdate(req.params.rosterId, roster, {
    new: true,
    runValidators: true,
  });

  res.status(SUCCESS).json({
    success: true,
    message: "Availability has been submitted, thank you for your service",
    data: usersGivenDates,
  });
});

//Check already submitted dates  => /roster/submitted/:rosterId/:userId
exports.givenDates = catchAsyncErrors(async (req, res, next) => {
  if (!req.params.rosterId) {
    return next(
      new ErrorHandler(
        "Link is corrupted, please ask WP for a new link",
        NOT_FOUND
      )
    );
  }

  //lets get the roster first
  let roster = await Roster.findById(req.params.rosterId);
  if (!roster) {
    return next(new ErrorHandler("Roster not found", NOT_FOUND));
  }

  //find out if user has already given dates
  let usersGivenDates = roster.datesGiven.find(
    (x) => x.userId === req.params.userId
  );

  console.log({ usersGivenDates });

  res.status(SUCCESS).json({
    success: true,
    message: "Submitted dates",
    data: usersGivenDates,
  });
});

//Get all rosters  => /roster/all
exports.getAllRosters = catchAsyncErrors(async (req, res, next) => {
  //lets get the roster first
  let rosters = await Roster.find();
  if (!rosters) {
    return next(new ErrorHandler("No rosters available", NOT_FOUND));
  }

  res.status(SUCCESS).json({
    success: true,
    message: "All rosters currently in data",
    data: rosters,
  });
});

//Get roster  => /roster or through query month or id
exports.getRoster = catchAsyncErrors(async (req, res, next) => {
  //lets get the roster first
  let roster;

  if (req.query.id) {
    roster = await Roster.findById(req.query.id);
  } else if (req.query.month) {
    roster = await Roster.find({ month: req.query.month });
  }
  if (!roster) {
    return next(new ErrorHandler("No roster available", NOT_FOUND));
  }

  res.status(SUCCESS).json({
    success: true,
    message: "Here is the roster",
    data: roster,
  });
});

//Delete roster -> /roster/delete/:rosterId
exports.deleteRoster = catchAsyncErrors(async (req, res, next) => {
  //lets get the roster first
  try {
    // Find the roster by ID and delete it
    const deleteRoster = await Roster.findByIdAndDelete(req.params.rosterId);

    // Check if the post exists
    if (!deleteRoster) {
      return next(new ErrorHandler("Roster not found", NOT_FOUND));
    }

    // Send a success response
    res.status(SUCCESS).json({
      success: true,
      message: "Roster has been deleted",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Roster deletion failed",
    });
  }
});
