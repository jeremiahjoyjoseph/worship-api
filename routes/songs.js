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
router.route("/song/all").get(isAuthenticatedUser, getSongs);

//Get song detail
router.route("/song/:id/:title").get(isAuthenticatedUser, getSong);

//Register a new song
router
  .route("/song/new")
  .post(isAuthenticatedUser, authorizeRoles("worship-pastor"), newSong);

//Upload lyrics document
router
  .route("/song/upload-lyrics/:id")
  .put(isAuthenticatedUser, authorizeRoles("worship-pastor"), uploadLyrics);

//Update song
router
  .route("/song/update/:id")
  .put(isAuthenticatedUser, authorizeRoles("worship-pastor"), updateSong);

//Delete song
router
  .route("/song/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("worship-pastor"), deleteSong);

module.exports = router;
