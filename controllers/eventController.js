const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { Event } = require("../models/event");
const ErrorHandler = require("../util/errorHandler");
const { SUCCESS, BAD_REQUEST, NOT_FOUND } = require("../util/httpStatusCodes");

exports.createEvent = catchAsyncErrors(async (req, res, next) => {
  let event = await Event.findOne({ eventName: req.body.eventName });

  if (event) {
    return next(new ErrorHandler("Event already exists", BAD_REQUEST));
  }

  event = await Event.create(req.body);

  res.status(SUCCESS).json({
    success: true,
    message: "Event has been added",
    data: event,
  });
});

exports.getEvents = catchAsyncErrors(async (req, res, next) => {
  let event = await Event.find();

  if (!event) {
    return next(new ErrorHandler("Events not found", NOT_FOUND));
  }

  res.status(SUCCESS).json({
    success: true,
    data: event,
  });
});
