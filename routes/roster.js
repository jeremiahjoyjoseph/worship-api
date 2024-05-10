const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
  generateRoster,
  submitAvailability,
  getAllRosters,
  getRoster,
  deleteRoster,
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
  .route("/roster")
  .get(isAuthenticatedUser, authorizeRoles("worship-team-member"), getRoster);
router
  .route("/roster/availability/:rosterId/:userId")
  .post(
    isAuthenticatedUser,
    authorizeRoles("worship-team-member"),
    submitAvailability
  );

//Worship pastor and above only
router
  .route("/roster/generate")
  .post(isAuthenticatedUser, authorizeRoles("worship-pastor"), generateRoster);
router
  .route("/roster/delete/:rosterId")
  .delete(isAuthenticatedUser, authorizeRoles("worship-pastor"), deleteRoster);

module.exports = router;
