const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { generateRoster } = require("../controllers/rosterController");

//Worship pastor and above only
router
  .route("/roster/generate")
  .post(isAuthenticatedUser, authorizeRoles("worship-pastor"), generateRoster);

module.exports = router;
