//Get all songs => /api/v1/jobs
exports.getSongs = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "This route will display all songs in future.",
  });
};
