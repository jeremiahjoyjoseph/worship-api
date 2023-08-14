const express = require("express");
const router = express.Router();

//Importing jobs controller methods
const { getSongs } = require("../controllers/songsController");

router.route("/songs").get(getSongs);

module.exports = router;
