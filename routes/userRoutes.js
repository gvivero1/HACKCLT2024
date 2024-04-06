const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');


//Get /user/new: send html form for creating a nwer user account
router.get("/login", controller.getUserLogin);

router.post("/login",controller.login);

router.get("/new", controller.getNew);

router.post("/new", controller.postNew);

module.exports = router;