const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { Location } = require("../models/location");
const ErrorHandler = require("../util/errorHandler");
const { SUCCESS, BAD_REQUEST, NOT_FOUND } = require("../util/httpStatusCodes");

exports.createLocation = catchAsyncErrors(async (req, res, next) => {
  let location = await Location.findOne({ eventName: req.body.name });

  if (location) {
    return next(new ErrorHandler("Location already exists", BAD_REQUEST));
  }

  location = await Location.create(req.body);

  res.status(SUCCESS).json({
    success: true,
    message: "Location has been added",
    data: location,
  });
});

exports.getLocations = catchAsyncErrors(async (req, res, next) => {
  let location = await Location.find();

  if (!location) {
    return next(new ErrorHandler("No Locations", NOT_FOUND));
  }

  res.status(SUCCESS).json({
    success: true,
    data: location,
  });
});
