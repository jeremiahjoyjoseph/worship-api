const express = require("express");
const router = express.Router();

//Importing jobs controller methods
const {
  getSongs,
  newSong,
  updateSong,
  deleteSong,
  getSong,
  uploadLyrics,
} = require("../controllers/songsController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

//Get all songs
router.route("/songs").get(isAuthenticatedUser, getSongs);

//Get song detail
router.route("/songs/:id/:slug").get(isAuthenticatedUser, getSong);

//Register a new song
router
  .route("/songs/new")
  .post(isAuthenticatedUser, authorizeRoles("worship-pastor"), newSong);

//Upload lyrics document
router
  .route("/songs/upload-lyrics/:id")
  .put(isAuthenticatedUser, authorizeRoles("worship-pastor"), uploadLyrics);

//Update song
router
  .route("/songs/:id")
  .put(isAuthenticatedUser, authorizeRoles("worship-pastor"), updateSong);

//Delete song
router
  .route("/songs/:id")
  .delete(isAuthenticatedUser, authorizeRoles("worship-pastor"), deleteSong);

module.exports = router;
