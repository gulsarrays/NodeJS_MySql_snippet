const express = require('express');
const RepoController = require('../controllers/repoController');

const router = express.Router();

/* CRUD routes. */
router.get('/', RepoController.list);
router.post('/', RepoController.create);
router.get('/:id', RepoController.details);
router.put('/:id', RepoController.update);
router.delete('/:id', RepoController.delete);

module.exports = router;
