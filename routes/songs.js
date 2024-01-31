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
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/songs").get(getSongs);
router
  .route("/songs/new")
  .post(isAuthenticatedUser, authorizeRoles("worship-pastor"), newSong);
router
  .route("/songs/:id")
  .put(isAuthenticatedUser, authorizeRoles("worship-pastor"), updateSong);
router
  .route("/songs/:id")
  .delete(isAuthenticatedUser, authorizeRoles("worship-pastor"), deleteSong);
router.route("/songs/:id/:slug").get(getSong);

module.exports = router;
