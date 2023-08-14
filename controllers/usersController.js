//Get all songs => /api/v1/jobs
exports.getUsers = (req, res) => {
  res.status(200).json({
    success: true,
    message: "This route will display all users in future.",
  });
};
