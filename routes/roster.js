const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
  generateRoster,
  submitAvailability,
  getAllRosters,
  getRoster,
} = require("../controllers/rosterController");

//Team members
router
  .route("/roster/all")
  .get(
    isAuthenticatedUser,
    authorizeRoles("worship-team-member"),
    getAllRosters
  );
router
  .route("/roster/:id")
  .get(isAuthenticatedUser, authorizeRoles("worship-team-member"), getRoster);
router
  .route("/roster/availability/:id")
  .post(
    isAuthenticatedUser,
    authorizeRoles("worship-team-member"),
    submitAvailability
  );

//Worship pastor and above only
router
  .route("/roster/generate")
  .post(isAuthenticatedUser, authorizeRoles("worship-pastor"), generateRoster);

module.exports = router;
