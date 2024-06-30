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

router.route("/data").get(isAuthenticatedUser, getUserProfile);
router.route("/all").get(getAllUsers);
router.route("/update/username").put(isAuthenticatedUser, updateUsername);
router.route("/update/password").put(isAuthenticatedUser, updatePassword);
router.route("/delete").delete(isAuthenticatedUser, deleteSelf);

//Worship pastor and above only
router
  .route("/update/role")
  .put(isAuthenticatedUser, authorizeRoles("worship-pastor"), updateRole);
router
  .route("/update/password/:id")
  .put(isAuthenticatedUser, authorizeRoles("worship-pastor"), updatePassword);
router
  .route("/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("worship-pastor"), deleteUser);
router
  .route("/update/data/:id")
  .put(isAuthenticatedUser, authorizeRoles("worship-pastor"), updateUserData);

module.exports = router;
