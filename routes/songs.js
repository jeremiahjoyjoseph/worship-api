const express = require("express");
const router = express.Router();

router.get("/songs", (req, res) => {
  res.status(200).json({
    success: true,
    message: "This route will display all songs in future.",
  });
});

module.exports = router;
