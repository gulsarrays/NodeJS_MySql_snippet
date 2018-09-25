const { Event } = require('../models/events');
const { Actor } = require('../models/actors');
const { Repo } = require('../models/repos');

const EraseController = {};

/* Erase all the data */
EraseController.erase = async (req, res) => {
  const p1 = await Event.erase();
  const p2 = await Actor.erase();
  const p3 = await Repo.erase();

  Promise.all([p1, p2, p3])
    .then(result => res.send(result))
    .catch(err => res.status(500).send(err));
};

module.exports = EraseController;
