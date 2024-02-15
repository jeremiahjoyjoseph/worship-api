const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Song = require("../models/songs");
const ErrorHandler = require("../util/errorHandler");
const {
  NOT_FOUND,
  SUCCESS,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require("../util/httpStatusCodes");

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
  let song = Song.find({ title: req.body.title, artist: req.body.artist });

  if (song) {
    return next(new ErrorHandler("Song already exists", BAD_REQUEST));
  }

  req.body.createdBy = req.user.id;
  song = await Song.create(req.body);

  res.status(SUCCESS).json({
    success: true,
    message: "Song has been added",
    data: song,
  });
});

//Create new song => /api/v1/songs/upload-lyrics/:id
exports.uploadLyrics = catchAsyncErrors(async (req, res, next) => {
  let song = await Song.findById(req.params.id);

  if (!song) {
    return next(new ErrorHandler("Song not found", BAD_REQUEST));
  }

  // Check the files
  if (!req.files) {
    return next(new ErrorHandler("Please upload file", BAD_REQUEST));
  }

  const file = req.files.file;

  // Check file type
  const supportedFiles = /.docx|.pdf/;
  if (!supportedFiles.test(path.extname(file.name))) {
    return next(new ErrorHandler("Please upload document file", BAD_REQUEST));
  }

  // Check document size
  if (file.size > process.env.MAX_FILE_SIZE) {
    return next(
      new ErrorHandler("Please upload file less than 2MB", BAD_REQUEST)
    );
  }

  // Renaming lyrics doc
  file.name = `${song.title}_${song.artist}${path.parse(file.name).ext}`;

  file.mv(`${process.env.UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(
        new ErrorHandler("Lyrics doc upload failed", INTERNAL_SERVER_ERROR)
      );
    }

    await Song.findByIdAndUpdate(
      req.params.id,
      {
        lyricsFileName: file.name,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(SUCCESS).json({
      success: true,
      message: "lyrics document uploaded successfully",
      data: file.name,
    });
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

//Delete song => /api/v1/song/delete/:id
exports.deleteSong = catchAsyncErrors(async (req, res, next) => {
  let song = await Song.findById(req.params.id);

  if (!song) {
    return next(new ErrorHandler("Song not found", NOT_FOUND));
  }

  await Song.findByIdAndDelete(req.params.id);

  res.status(SUCCESS).json({
    success: true,
    message: "Song has been deleted",
  });
});

//get song => /api/v1/songs/:id/:slug
exports.getSong = catchAsyncErrors(async (req, res, next) => {
  let song = await Song.find({
    $and: [{ _id: req.params.id }, { title: req.params.title }],
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
