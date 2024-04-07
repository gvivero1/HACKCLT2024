const express = require('express');
const controller = require('../controllers/blueprintController');

const router = express.Router();

router.get('/', controller.index); // show all blueprints

router.get('/start', controller.showStart); // show the create blueprint start screen - input blueprint name and add experiences

router.post('/start', controller.start); // create a new blueprint and add the name to it

router.get('/job', controller.showJob); // show the form to enter job details

router.post('/job', controller.createJob); // take job details, create a new job in the db, then add the job id to the blueprint

router.get('/create', controller.getLoading); // shows a loading screen while ai does its job

router.post('/create', controller.finishBlueprint); // show the newly created blueprint w/ next steps, timeline, etc

router.get('/:id', controller.show); // show a single blueprint
module.exports = router;