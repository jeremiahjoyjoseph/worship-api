const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../util/errorHandler");
const Roster = require("../models/roster");
const {
  SUCCESS,
  BAD_REQUEST,
  UNAUTHORIZED,
} = require("../util/httpStatusCodes");

const moment = require("moment");

//Generate roster by selecting month  => /roster/generate
exports.generateRoster = catchAsyncErrors(async (req, res, next) => {
  let body = req.body;

  let roster = await Roster.create({
    ...body,
  });

  res.status(SUCCESS).json({
    success: true,
    message: "Roster has been generated",
    data: roster,
  });
});
