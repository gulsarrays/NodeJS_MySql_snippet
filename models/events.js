const Joi = require('joi');
const connection = require('../middleware/db');

const EventModel = {};

EventModel.list = () =>
  new Promise((resolve, reject) => {
    connection.query(
      'SELECT e.id as eventId, e.type as eventType, e.created_at, a.id as actorId, a.login as actorLogin, a.avatar_url as actorAvatarUrl, r.id as repoId, r.name as repoName, r.url as repoUrl FROM events e, actors a, repos r WHERE e.actor = a.id and e.repo = r.id',
      null,
      (error, results) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(results);
        }
      }
    );
  });

EventModel.create = req => {
  const event = {
    id: req.body.id !== undefined ? req.body.id : null,
    type: req.body.type,
    actor: req.body.actor,
    repo: req.body.repo,
    created_at:
      req.body.created_at !== undefined ? req.body.created_at : Date.now
  };
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO events SET ?', event, (error, results) => {
      if (error) {
        reject(new Error(error));
      } else {
        resolve(results);
      }
    });
  });
};

EventModel.details = req =>
  new Promise((resolve, reject) => {
    connection.query(
      'SELECT e.id as eventId, e.type as eventType, e.created_at, a.id as actorId, a.login as actorLogin, a.avatar_url as actorAvatarUrl, r.id as repoId, r.name as repoName, r.url as repoUrl FROM events e, actors a, repos r WHERE e.actor = a.id and e.repo = r.id and e.id=?',
      req.params.id,
      (error, results) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(results);
        }
      }
    );
  });

EventModel.update = req =>
  new Promise((resolve, reject) => {
    connection.query(
      'UPDATE events set type=?, actor=?, repo=? where id=?',
      [req.body.type, req.body.actor.id, req.body.repo.id, req.params.id],
      (error, results) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(results);
        }
      }
    );
  });

EventModel.delete = req =>
  new Promise((resolve, reject) => {
    connection.query(
      'DELETE FROM events where id=?',
      req.params.id,
      (error, results) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(results);
        }
      }
    );
  });

EventModel.erase = () =>
  new Promise((resolve, reject) => {
    connection.query('TRUNCATE TABLE `events`', null, (error, results) => {
      if (error) {
        reject(new Error(error));
      } else {
        resolve(results);
      }
    });
  });

EventModel.isDuplicate = (type, actor, createdDate = null, id = 0) => {
  let createdDateQry = '';
  if (createdDate !== null) {
    createdDateQry = ` AND created_at='${createdDate}'`;
  }
  let sqlQry = `SELECT count(*) as count FROM events WHERE type='${type}' AND actor=${actor}${createdDateQry}`;

  if (id > 0) {
    sqlQry = `SELECT count(*) as count FROM events WHERE type='${type}' AND actor=${actor} AND id != ${id} ${createdDateQry}`;
  }
  return new Promise((resolve, reject) => {
    connection.query(sqlQry, null, (error, results) => {
      if (error) {
        reject(new Error(error));
      } else {
        resolve(results);
      }
    });
  });
};

/* Actors event listing */
EventModel.actorsEvent = req =>
  new Promise((resolve, reject) => {
    connection.query(
      'SELECT e.id as eventId, e.type as eventType, e.created_at, a.id as actorId, a.login as actorLogin, a.avatar_url as actorAvatarUrl, r.id as repoId, r.name as repoName, r.url as repoUrl FROM events e, actors a, repos r WHERE e.actor = a.id and e.repo = r.id and e.actor=?',
      req.params.id,
      (error, results) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(results);
        }
      }
    );
  });

function validate(data) {
  const schema = {
    id: Joi.number()
      .min(0)
      .max(99999999999),
    type: Joi.string()
      .min(5)
      .max(55)
      .required(),
    actor: Joi.object()
      .keys({
        id: Joi.number()
          .min(0)
          .max(99999999999)
          .integer(),
        login: Joi.string()
          .min(5)
          .max(55)
          .required(),
        avatar_url: Joi.string()
          .min(5)
          .max(55)
          .required()
      })
      .required(),
    repo: Joi.object()
      .keys({
        id: Joi.number()
          .min(0)
          .max(99999999999)
          .integer(),
        name: Joi.string()
          .min(5)
          .max(55)
          .required(),
        url: Joi.string()
          .min(5)
          .max(55)
          .required()
      })
      .required(),
    created_at: Joi.date()
  };
  return Joi.validate(data, schema);
}

module.exports.validate = validate;
module.exports.Event = EventModel;
