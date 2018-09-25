const express = require('express');
const EraseController = require('../controllers/eraseController');

const router = express.Router();

/* Erase all the data */
router.delete('/', EraseController.erase);

module.exports = router;
