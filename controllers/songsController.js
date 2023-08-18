const Song = require("../models/songs");

//Get all songs => /api/v1/songs
exports.getSongs = async (req, res, next) => {
  const songs = await Song.find();

  res.status(200).json({
    success: true,
    message: "All songs",
    results: songs.length,
    data: songs,
  });
};

//Create new song => /api/v1/songs/new
exports.newSong = (req, res, next) => {
  const song = Song.create(req.body);

  res.status(200).json({
    success: true,
    message: "Song has been added",
    data: req.body,
  });
};

//Update song => /api/v1/songs/:id
exports.updateSong = async (req, res, next) => {
  let song = await Song.findById(req.params.id);

  if (!song) {
    res.status(404).json({
      success: false,
      message: "Song not found",
    });
  }

  song = await Song.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Song has been updated",
    data: song,
  });
};

//Delete song => /api/v1/songs/:id
exports.deleteSong = async (req, res, next) => {
  let song = await Song.findById(req.params.id);

  if (!song) {
    res.status(404).json({
      success: false,
      message: "Song not found",
    });
  }

  song = await Song.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "Song has been deleted",
    data: song,
  });
};
