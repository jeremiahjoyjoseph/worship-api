const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
  generateRoster,
  submitAvailability,
  getAllRosters,
  getRoster,
  deleteRoster,
  usersSubmittedDates,
} = require("../controllers/rosterController");

//Team members
router.route("").get(getRoster);
router
  .route("/all")
  .get(
    isAuthenticatedUser,
    authorizeRoles("worship-team-member"),
    getAllRosters
  );
router.route("/availability/:rosterId/:userId").post(submitAvailability);

router
  .route("/submitted/:rosterId/:userId")
  .get(
    isAuthenticatedUser,
    authorizeRoles("worship-team-member"),
    usersSubmittedDates
  );

//Worship pastor and above only
router
  .route("/generate")
  .post(isAuthenticatedUser, authorizeRoles("worship-pastor"), generateRoster);
router
  .route("/delete/:rosterId")
  .delete(isAuthenticatedUser, authorizeRoles("worship-pastor"), deleteRoster);

module.exports = router;
