const express = require("express");
const controller = require("../controllers/userController");

const router = express.Router();

//Get /user/new: send html form for creating a nwer user account
router.get("/login", controller.getUserLogin);

router.get("/new", controller.getNew);

router.post("/new", controller.postNew);

module.exports = router;