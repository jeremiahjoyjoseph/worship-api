const express = require("express");
const router = express.Router();

//Importing jobs controller methods
const { getUsers } = require("../controllers/usersController");

router.route("/users").get(getUsers);

module.exports = router;
