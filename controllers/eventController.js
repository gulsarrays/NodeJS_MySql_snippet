const { Actor } = require('../models/actors');
const { Repo } = require('../models/repos');
const { Event, validate } = require('../models/events');

const EventController = {};

/* eslint-disable */
function getEventData(result) {
  const resultData = [];
  for (const tmpData of result) {
    resultData.push({
      id: tmpData.eventId,
      type: tmpData.eventType,
      actor: {
        id: tmpData.actorId,
        login: tmpData.actorLogin,
        avatar_url: tmpData.actorAvatarUrl
      },
      repo: {
        id: tmpData.repoId,
        name: tmpData.repoName,
        url: tmpData.repoUrl
      },
      created_at: tmpData.created_at
    });
  }
  return resultData;
}
/* eslint-enable */

/* CRUD operation START */
EventController.list = async (req, res) => {
  let result = await Event.list();

  let resultData = [];

  if (result.length > 0) resultData = getEventData(result);

  if (resultData.length === 0) {
    result = 'No data available';
    return res.status(204).send(result);
  }

  return res.send(resultData);
};

EventController.create = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isDuplicate = await Event.isDuplicate(
    req.body.type,
    req.body.actor.id,
    req.body.created_at !== undefined ? req.body.created_at : null,
    0
  );
  if (isDuplicate[0].count > 0)
    return res
      .status(400)
      .send('Invalid Data - Event with given name is already exists');

  const repoData = {
    body: {
      id: req.body.repo.id,
      name: req.body.repo.name,
      url: req.body.repo.url
    }
  };
  let repoId;
  const isRepoExistsReq = { params: { id: req.body.repo.id } };
  const isRepoExists = await Repo.details(isRepoExistsReq);
  if (isRepoExists.length === 0) {
    const repoResult = await Repo.create(repoData);
    repoId = repoResult.insertId;
  } else {
    repoId = req.body.repo.id;
  }

  const actorData = {
    body: {
      id: req.body.actor.id,
      login: req.body.actor.login,
      avatar_url: req.body.actor.avatar_url
    }
  };

  let actorId;
  const isActorExistsReq = { params: { id: req.body.actor.id } };
  const isActorExists = await Actor.details(isActorExistsReq);
  if (isActorExists.length === 0) {
    const actorResult = await Actor.create(actorData);
    actorId = actorResult.insertId;
  } else {
    actorId = req.body.actor.id;
  }

  const eventData = {
    body: {
      id: req.body.id,
      type: req.body.type,
      repo: repoId,
      actor: actorId,
      created_at:
        req.body.created_at !== undefined ? req.body.created_at : Date.now
    }
  };

  const result = await Event.create(eventData);
  return res.status(201).send(result);
};

EventController.details = async (req, res) => {
  let result = await Event.details(req);

  let resultData = [];

  if (result.length > 0) resultData = getEventData(result);

  if (resultData.length === 0) {
    result = 'No data available';
    return res.status(404).send(result);
  }

  return res.send(resultData);
};

EventController.update = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isDuplicate = await Event.isDuplicate(
    req.body.type,
    req.body.actor.id,
    req.body.created_at !== undefined ? req.body.created_at : null,
    req.params.id
  );
  if (isDuplicate[0].count > 0)
    return res
      .status(400)
      .send('Invalid Data - Event with given name is already exists');

  let result = await Event.update(req);

  if (result.affectedRows === 0) {
    result = 'No data available';
    return res.status(404).send(result);
  }

  return res.send(result);
};

EventController.delete = async (req, res) => {
  let result = await Event.delete(req);

  if (result.affectedRows === 0) {
    result = 'No data available';
    return res.status(404).send(result);
  }

  return res.send(result);
};

/* CRUD operation END */

/* Actors event listing */
EventController.actorsEvent = async (req, res) => {
  let result = await Event.actorsEvent(req);
  let resultData = [];

  if (result.length > 0) resultData = getEventData(result);

  if (resultData.length === 0) {
    result = 'No data available';
    return res.status(404).send(result);
  }

  return res.send(resultData);
};

module.exports = EventController;
