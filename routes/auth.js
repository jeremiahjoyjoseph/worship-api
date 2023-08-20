const express = require("express");
const router = express.Router();

//Importing jobs controller methods
const { registerUser } = require("../controllers/authController");

router.route("/register").post(registerUser);

module.exports = router;
