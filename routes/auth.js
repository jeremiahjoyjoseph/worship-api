const express = require("express");
const router = express.Router();

//Importing jobs controller methods
const {
  registerUser,
  loginUser,
  logout,
} = require("../controllers/authController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

//Internal use only
router
  .route("/register/admin")
  .post(isAuthenticatedUser, authorizeRoles("admin"), registerUser);

//Only admin and worship-pastor can register members
router
  .route("/register")
  .post(isAuthenticatedUser, authorizeRoles("worship-pastor"), registerUser);

//For guest users to log in
router.route("/register/guest").post(registerUser);

router.route("/login").post(loginUser);

//update another users role
router.route("/logout").get(isAuthenticatedUser, logout);

module.exports = router;
