const moment = require("moment");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Roster = require("../models/roster");
const User = require("../models/user");
const ErrorHandler = require("../util/errorHandler");

const {
  SUCCESS,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../util/httpStatusCodes");

function getAllSundays(year, month) {
  let sundays = [];
  let date = moment(`${year}-${month}-01`, "YYYY-MM-DD");

  // Start at the first Sunday of the month
  while (date.month() + 1 === month) {
    if (date.day() === 0) {
      // 0 corresponds to Sunday
      sundays.push(date.format("YYYY-MM-DD")); // Format as 'YYYY-MM-DD' string
    }
    date.add(1, "days"); // Move to the next day
  }

  return sundays;
}

//Generate roster by selecting month  => /roster/generate
exports.generateRoster = catchAsyncErrors(async (req, res, next) => {
  let body = req.body;

  //retrieve all users and create slots in roster.submissions
  let users;
  try {
    users = await User.find().select(
      "-password -email -phone -dob -createdAt -updatedAt -slug --v"
    );
  } catch (error) {
    console.log("Generate Roster Get Users Error", error);
  }
  let submissions = [];
  users.forEach((user) => {
    if (user.status === "active") {
      submissions.push({
        userId: user._id,
        userData: user,
        hasSubmittedDates: false,
        submittedDates: [],
      });
    }
  });
  body.submissions = submissions;

  let requiredDates = getAllSundays(body.year, body.month);

  body.requiredDates = requiredDates;

  //create roster
  let roster = await Roster.create({
    ...body,
  });

  let rosterUrl = new URL(
    `/submit/availability/${roster._id}`,
    process.env.CLIENT_DOMAIN
  ).toString();

  // Update the roster with the generated URL
  roster = await Roster.findByIdAndUpdate(
    roster._id,
    { rosterUrl: rosterUrl },
    { new: true } // Return the updated document
  );

  res.status(SUCCESS).json({
    success: true,
    message: "Roster has been generated",
    data: roster,
  });
});

//Check already submitted dates  => /roster/submitted/:rosterId/:userId
exports.usersSubmittedDates = catchAsyncErrors(async (req, res, next) => {
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
  let userSubmission = roster.submissions.find(
    (x) => x.userId === req.params.userId
  );

  res.status(SUCCESS).json({
    success: true,
    message: "Submitted dates",
    data: userSubmission.submittedDates,
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

  // Find the index of the submission by userId
  const submissionIndex = roster.submissions.findIndex(
    (sub) => sub.userId === req.params.userId
  );
  if (submissionIndex === -1) {
    return next(
      new ErrorHandler("Submission not found for the given userId", NOT_FOUND)
    );
  }

  // Update the submission with new data
  roster.submissions[submissionIndex] = {
    ...roster.submissions[submissionIndex]._doc, // Keep other properties intact
    hasSubmittedDates: true,
    submittedDates: req.body,
  };

  await Roster.findByIdAndUpdate(req.params.rosterId, roster, {
    new: true,
    runValidators: true,
  });

  res.status(SUCCESS).json({
    success: true,
    message: "Availability has been submitted",
    data: roster.submissions[submissionIndex],
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
