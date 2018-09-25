const express = require('express');
const EventController = require('../controllers/eventController');

const router = express.Router();

/* CRUD routes. */
router.get('/', EventController.list);
router.post('/', EventController.create);
router.get('/:id', EventController.details);
router.put('/:id', EventController.update);
router.delete('/:id', EventController.delete);

/* GET actor event listing. */
router.get('/actors/:id', EventController.actorsEvent);

module.exports = router;
