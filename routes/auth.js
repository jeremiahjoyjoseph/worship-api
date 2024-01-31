const express = require("express");
const router = express.Router();

//Importing jobs controller methods
const {
  registerUser,
  loginUser,
  updateUsername,
  updatePassword,
  updateRole,
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

router.route("/update/username").put(isAuthenticatedUser, updateUsername);

router.route("/update/password").put(isAuthenticatedUser, updatePassword);

//update another users role
router
  .route("/update/role")
  .put(isAuthenticatedUser, authorizeRoles("worship-pastor"), updateRole);

module.exports = router;
