const express = require("express");
const router = express.Router();

//Importing jobs controller methods
const {
  getSongs,
  newSong,
  updateSong,
} = require("../controllers/songsController");

router.route("/songs").get(getSongs);
router.route("/songs/new").post(newSong);
router.route("/songs/:id").put(updateSong);

module.exports = router;
