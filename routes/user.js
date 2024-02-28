const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
  getUserProfile,
  updateUsername,
  updatePassword,
  updateRole,
  deleteUser,
  getAllUsers,
  deleteSelf,
  updateUserData,
} = require("../controllers/UserController");

router.route("/user/data").get(isAuthenticatedUser, getUserProfile);
router.route("/user/all").get(isAuthenticatedUser, getAllUsers);
router.route("/user/update/username").put(isAuthenticatedUser, updateUsername);
router.route("/user/update/password").put(isAuthenticatedUser, updatePassword);
router.route("/user/delete").delete(isAuthenticatedUser, deleteSelf);

//Worship pastor and above only
router
  .route("/user/update/role")
  .put(isAuthenticatedUser, authorizeRoles("worship-pastor"), updateRole);
router
  .route("/user/update/password/:id")
  .put(isAuthenticatedUser, authorizeRoles("worship-pastor"), updatePassword);
router
  .route("/user/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("worship-pastor"), deleteUser);
router
  .route("/user/update/data/:id")
  .put(isAuthenticatedUser, authorizeRoles("worship-pastor"), updateUserData);

module.exports = router;
