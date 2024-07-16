const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { createEvent, getEvents } = require("../controllers/eventController");

router
  .route("/new")
  .post(isAuthenticatedUser, authorizeRoles("worship-pastor"), createEvent);
router.route("/all").get(getEvents);

module.exports = router;
