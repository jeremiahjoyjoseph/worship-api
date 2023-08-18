const express = require("express");
const router = express.Router();

//Importing jobs controller methods
const {
  getSongs,
  newSong,
  updateSong,
  deleteSong,
  getSong,
} = require("../controllers/songsController");

router.route("/songs").get(getSongs);
router.route("/songs/new").post(newSong);
router.route("/songs/:id").put(updateSong);
router.route("/songs/:id").delete(deleteSong);
router.route("/songs/:id/:slug").get(getSong);

module.exports = router;
