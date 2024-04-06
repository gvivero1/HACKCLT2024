const express = require("express");
const controller = require("../controllers/userController");

const router = express.Router();

//Get /user/new: send html form for creating a nwer user account
router.get("/login", controller.getUserLogin);

module.exports = router;