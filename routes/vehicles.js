const express = require('express');
const { body } = require('express-validator');

const controller = require('../controllers/vehicles');

const router = express.Router();

router.get('/vehicle/:id', controller.getVehicleById);

router.get('/recent', controller.getRecent);

router.get('/search', controller.search);

router.get('/all', controller.getAll);

router.post('/vehicle/:id/feedback', controller.provideFeedback);

router.post('/vehicle/', controller.addVehicle);

router.post('/vehicle/:id/feedback', controller.provideFeedback);

module.exports = router;
