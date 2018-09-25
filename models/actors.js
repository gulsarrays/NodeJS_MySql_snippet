const Joi = require('joi');
const connection = require('../middleware/db');

const ActorModel = {};

ActorModel.list = () =>
  new Promise((resolve, reject) => {
    connection.query('SELECT * FROM actors where ?', 1, (error, results) => {
      if (error) {
        reject(new Error(error));
      } else {
        resolve(results);
      }
    });
  });

ActorModel.create = req => {
  const actor = {
    login: req.body.login,
    avatar_url: req.body.avatar_url,
    id: req.body.id !== undefined ? req.body.id : null
  };

  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO actors SET ?', actor, (error, results) => {
      if (error) {
        reject(new Error(error));
      } else {
        resolve(results);
      }
    });
  });
};

ActorModel.details = req => {
  let actorId;

  if (req.params.id !== undefined) {
    actorId = req.params.id;
  } else if (req.query.id !== undefined) {
    actorId = req.query.id;
  }

  return new Promise((resolve, reject) => {
    connection.query(
      'SELECT * FROM actors where id=?',
      actorId,
      (error, results) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(results);
        }
      }
    );
  });
};

ActorModel.update = req =>
  new Promise((resolve, reject) => {
    connection.query(
      'UPDATE actors set login=?, avatar_url=? where id=?',
      [req.body.login, req.body.avatar_url, req.body.id],
      (error, results) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(results);
        }
      }
    );
  });

ActorModel.delete = req =>
  new Promise((resolve, reject) => {
    connection.query(
      'DELETE FROM actors where id=?',
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

ActorModel.erase = () =>
  new Promise((resolve, reject) => {
    connection.query('TRUNCATE TABLE `actors`', null, (error, results) => {
      if (error) {
        reject(new Error(error));
      } else {
        resolve(results);
      }
    });
  });

ActorModel.isDuplicate = (login, id = 0) => {
  let sqlQry = `SELECT count(*) as count FROM actors where login='${login}'`;
  if (id > 0) {
    sqlQry = `SELECT count(*) as count FROM actors where login='${login}' and id != ${id} `;
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
ActorModel.actorStreak = (login, id = 0) => {
  let sqlQry = `SELECT count(*) as count FROM actors where login='${login}'`;
  if (id > 0) {
    sqlQry = `SELECT count(*) as count FROM actors where login='${login}' and id != ${id} `;
  }
  return new Promise((resolve, reject) => {
    connection.query(sqlQry, null, (error, results) => {
      if (error) {
        reject(new Error(error));
      } else {
        resolve({
          status: true,
          data: results,
          message: 'Successfully fetched Actor'
        });
      }
    });
  });
};

function validate(data) {
  const schema = {
    id: Joi.number()
      .min(0)
      .max(999999),
    login: Joi.string()
      .min(5)
      .max(55)
      .required(),
    avatar_url: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(data, schema);
}

module.exports.validate = validate;
module.exports.Actor = ActorModel;
