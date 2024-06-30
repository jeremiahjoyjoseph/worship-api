const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { createEvent } = require("../controllers/eventController");

router
  .route("/new")
  .post(isAuthenticatedUser, authorizeRoles("worship-pastor"), createEvent);

module.exports = router;
