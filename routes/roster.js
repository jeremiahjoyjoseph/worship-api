const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
  generateRoster,
  submitAvailability,
} = require("../controllers/rosterController");

//Team members
router
  .route("/roster/availability")
  .post(
    isAuthenticatedUser,
    authorizeRoles("worship-pastor"),
    submitAvailability
  );

//Worship pastor and above only
router
  .route("/roster/generate")
  .post(isAuthenticatedUser, authorizeRoles("worship-pastor"), generateRoster);

module.exports = router;
