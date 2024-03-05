const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
  generateRoster,
  submitAvailability,
} = require("../controllers/rosterController");

//Team members
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
