const { ActorStreakRepo } = require('../repository/actorStreakRepo');
const { Actor, validate } = require('../models/actors');
const ActorUpdateByEventClass = require('../eventHandler/actorUpdateByEvent');

const actorUpdateEventClass = new ActorUpdateByEventClass();

async function updateFunction(req) {
  const finalResult = [];
  if (!req.body.id) {
    finalResult.push({
      error: true,
      status: 400,
      message: 'Please provide the actorId for update'
    });
    return finalResult;
  }

  const isDuplicate = await Actor.isDuplicate(req.body.login, req.body.id);
  if (isDuplicate[0].count > 0) {
    finalResult.push({
      error: true,
      status: 400,
      message: 'Invalid Data - Actor with given name is already exists'
    });
    return finalResult;
  }

  const actorId = req.body.id;
  delete req.body.id;
  const { error } = validate(req.body);
  if (error) {
    finalResult.push({
      error: true,
      status: 400,
      message: error.details[0].message
    });
    return finalResult;
  }

  req.body.id = actorId;

  const result = await Actor.update(req);

  if (result.affectedRows === 0) {
    finalResult.push({
      error: true,
      status: 404,
      message: 'No data available'
    });
    return finalResult;
  }
  finalResult.push({ error: false, status: 200, message: result });
  return finalResult;
}

const ActorController = {};

/* CRUD operation START */
ActorController.list = async (req, res) => {
  let result = await Actor.list();
  if (result.length === 0) {
    result = 'No data available';
    return res.status(204).send(result);
  }
  return res.send(result);
};

ActorController.create = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isDuplicate = await Actor.isDuplicate(req.body.login, 0);

  if (isDuplicate[0].count > 0)
    return res
      .status(400)
      .send('Invalid Data - Actor with given name is already exists');

  const actors = await Actor.create(req);
  return res.status(201).send(actors);
};

ActorController.details = async (req, res) => {
  let result = await Actor.details(req);

  if (result.length === 0) {
    result = 'No data available';
    return res.status(404).send(result);
  }

  return res.send(result);
};

ActorController.updateByPushEvent = async (req, res) => {
  actorUpdateEventClass.updateActor(req, res);
};
ActorController.update = async (req, res) => {
  await updateFunction(req, res);
};

ActorController.delete = async (req, res) => {
  let result = await Actor.delete(req);

  if (result.affectedRows === 0) {
    result = 'No data available';
    return res.status(404).send(result);
  }

  return res.send(result);
};

/* CRUD operation END */

/* get actors streak */
ActorController.actorStreak = async (req, res) => {
  const actorStreak = await ActorStreakRepo.streak(req, res);

  return res.send(actorStreak);
};

// ============== EVENT LISTENER START ==============

actorUpdateEventClass.on('PushEvent', async eventArg => {
  const { req, res } = eventArg;
  const result = await updateFunction(req);
  if (result[0].error === true) {
    return res.status(result[0].status).send(result[0].message);
  }
  return res.send(result[0].message);
});

// ============== EVENT LISTENER END ==============

module.exports = ActorController;
