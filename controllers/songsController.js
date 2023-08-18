const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Song = require("../models/songs");
const ErrorHandler = require("../util/errorHandler");
const { NOT_FOUND, SUCCESS } = require("../util/httpStatusCodes");

//Get all songs => /api/v1/songs
exports.getSongs = catchAsyncErrors(async (req, res, next) => {
  const songs = await Song.find();

  res.status(SUCCESS).json({
    success: true,
    message: "All songs",
    results: songs.length,
    data: songs,
  });
});

//Create new song => /api/v1/songs/new
exports.newSong = catchAsyncErrors(async (req, res, next) => {
  const song = await Song.create(req.body);

  res.status(SUCCESS).json({
    success: true,
    message: "Song has been added",
    data: song,
  });
});

//Update song => /api/v1/songs/:id
exports.updateSong = catchAsyncErrors(async (req, res, next) => {
  let song = await Song.findById(req.params.id);

  if (!song) {
    return next(new ErrorHandler("Song not found", NOT_FOUND));
  }

  song = await Song.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(SUCCESS).json({
    success: true,
    message: "Song has been updated",
    data: song,
  });
});

//Delete song => /api/v1/songs/:id
exports.deleteSong = catchAsyncErrors(async (req, res, next) => {
  let song = await Song.findById(req.params.id);

  if (!song) {
    return next(new ErrorHandler("Song not found", NOT_FOUND));
  }

  song = await Song.findByIdAndDelete(req.params.id);
  res.status(SUCCESS).json({
    success: true,
    message: "Song has been deleted",
    data: song,
  });
});

//get song => /api/v1/songs/:id/:slug
exports.getSong = catchAsyncErrors(async (req, res, next) => {
  let song = await Song.find({
    $and: [{ _id: req.params.id }, { slug: req.params.slug }],
  });

  if (!song) {
    return next(new ErrorHandler("Song not found", NOT_FOUND));
  }

  res.status(SUCCESS).json({
    success: true,
    message: "Song has been found",
    data: song,
  });
});
