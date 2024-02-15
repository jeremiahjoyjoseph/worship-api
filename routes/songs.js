const express = require("express");
const router = express.Router();

const {
  getSongs,
  newSong,
  updateSong,
  deleteSong,
  getSong,
  uploadLyrics,
} = require("../controllers/songsController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/song/all").get(isAuthenticatedUser, getSongs);

router.route("/song/:id/:title").get(isAuthenticatedUser, getSong);

//Worship Pastor and above only routes
router
  .route("/song/new")
  .post(isAuthenticatedUser, authorizeRoles("worship-pastor"), newSong);

router
  .route("/song/upload-lyrics/:id")
  .put(isAuthenticatedUser, authorizeRoles("worship-pastor"), uploadLyrics);

router
  .route("/song/update/:id")
  .put(isAuthenticatedUser, authorizeRoles("worship-pastor"), updateSong);

router
  .route("/song/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("worship-pastor"), deleteSong);

module.exports = router;
