const express = require("express");
const router = express.Router();

//Importing controller methods

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
  getUserProfile,
  updateUsername,
  updatePassword,
  updateRole,
  deleteUser,
  getAllUsers,
} = require("../controllers/UserController");

//getUserProfile
router.route("/user/data").get(isAuthenticatedUser, getUserProfile);

//getUserProfile
router
  .route("/user/all")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);

router.route("/user/update/username").put(isAuthenticatedUser, updateUsername);

router.route("/user/update/password").put(isAuthenticatedUser, updatePassword);

//update another users role
router
  .route("/user/update/role")
  .put(isAuthenticatedUser, authorizeRoles("worship-pastor"), updateRole);

//deleteUser
router
  .route("/user/delete")
  .delete(isAuthenticatedUser, authorizeRoles("worship-pastor"), deleteUser);

module.exports = router;
