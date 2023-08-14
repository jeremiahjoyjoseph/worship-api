const Song = require("../models/songs");

//Get all songs => /api/v1/jobs
exports.getSongs = (req, res, next) => {
  res.status(200).json({
    success: true,
    middlewareUser: req.user,
    message: "This route will display all songs in future.",
  });
};

exports.newSong = (req, res, next) => {
  const song = Song.create(req.body);

  res.status(200).json({
    success: true,
    message: "Song has been added",
    data: req.body,
  });
};
