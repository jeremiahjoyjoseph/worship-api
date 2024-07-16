const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
  createLocation,
  getLocations,
} = require("../controllers/locationController");

router
  .route("/new")
  .post(isAuthenticatedUser, authorizeRoles("worship-pastor"), createLocation);
router.route("/all").get(getLocations);

module.exports = router;
