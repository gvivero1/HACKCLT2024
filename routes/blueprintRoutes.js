const express = require('express');
const controller = require('../controllers/blueprintController');

const router = express.Router();

router.get('/', controller.index);

router.get('/:id', controller.show);

router.post('/create', controller.addBlueprint)

module.exports = router;