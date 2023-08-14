const express = require("express");
const router = express.Router();

//Importing jobs controller methods
const { getSongs, newSong } = require("../controllers/songsController");

router.route("/songs").get(getSongs);
router.route("/songs/new").post(newSong);

module.exports = router;
