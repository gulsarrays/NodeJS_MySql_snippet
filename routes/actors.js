const express = require('express');
const ActorController = require('../controllers/actorController');

const router = express.Router();

/* GET actors streak. */
router.get('/streak/', ActorController.actorStreak);

/* CRUD routes. */
router.get('/', ActorController.list);
router.post('/', ActorController.create);
router.get('/:id', ActorController.details);
router.put('/', ActorController.updateByPushEvent);
router.delete('/:id', ActorController.delete);

module.exports = router;
