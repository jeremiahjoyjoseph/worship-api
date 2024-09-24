const express = require("express");
const router = express.Router();

//Importing jobs controller methods
const {
  registerUser,
  loginUser,
  logout,
  registerUsersFromCSV,
} = require("../controllers/authController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

//Internal use only
router.route("/register/admin").post(registerUser);

//Only admin and worship-pastor can register members
router
  .route("/register")
  .post(isAuthenticatedUser, authorizeRoles("worship-pastor"), registerUser);

router.route("/register/csv").post(registerUsersFromCSV);

//For guest users to log in - not useful to this app
router.route("/register/guest").post(registerUser);

//login the user
router.route("/login").post(loginUser);

//update another users role
router.route("/logout").get(isAuthenticatedUser, logout);

module.exports = router;
