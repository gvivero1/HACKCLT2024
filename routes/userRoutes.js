const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');


//Get /user/new: send html form for creating a nwer user account
router.get("/", controller.getIndex);

router.get("/login", controller.getUserLogin);

router.post("/login",controller.login);

router.get("/new", controller.getNew);

router.post("/new", controller.postNew);

router.get("/getSkills", controller.getSkills);

router.post("/addSkills", controller.addSkills);

router.get("/logout", controller.logout);

module.exports = router;