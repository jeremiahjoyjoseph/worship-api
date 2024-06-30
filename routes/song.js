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

router.route("/all").get(isAuthenticatedUser, getSongs);
router.route("/:id/:title").get(isAuthenticatedUser, getSong);

//Worship Pastor and above only routes
router
  .route("/new")
  .post(isAuthenticatedUser, authorizeRoles("worship-pastor"), newSong);
router
  .route("/upload-lyrics/:id")
  .put(isAuthenticatedUser, authorizeRoles("worship-pastor"), uploadLyrics);
router
  .route("/update/:id")
  .put(isAuthenticatedUser, authorizeRoles("worship-pastor"), updateSong);
router
  .route("/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("worship-pastor"), deleteSong);

module.exports = router;
