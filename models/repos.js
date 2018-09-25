const Joi = require('joi');
const connection = require('../middleware/db');

const RepoModel = {};

RepoModel.list = async () =>
  new Promise((resolve, reject) => {
    connection.query('SELECT * FROM repos', null, (error, results) => {
      if (error) {
        reject(new Error(error));
      } else {
        resolve(results);
      }
    });
  });

RepoModel.create = async req => {
  const repos = {
    name: req.body.name,
    url: req.body.url,
    id: req.body.id !== undefined ? req.body.id : null
  };
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO repos SET ?', repos, (error, results) => {
      if (error) {
        reject(new Error(error));
      } else {
        resolve(results);
      }
    });
  });
};

RepoModel.details = async req =>
  new Promise((resolve, reject) => {
    connection.query(
      'SELECT * FROM repos where id=?',
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

RepoModel.update = async req =>
  new Promise((resolve, reject) => {
    connection.query(
      'UPDATE repos set name=?, url=? where id=?',
      [req.body.name, req.body.url, req.params.id],
      (error, results) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(results);
        }
      }
    );
  });

RepoModel.delete = async req =>
  new Promise((resolve, reject) => {
    connection.query(
      'DELETE FROM repos where id=?',
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

RepoModel.erase = async () =>
  new Promise((resolve, reject) => {
    connection.query('TRUNCATE TABLE `repos`', null, (error, results) => {
      if (error) {
        reject(new Error(error));
      } else {
        resolve(results);
      }
    });
  });

RepoModel.isDuplicate = async (name, id = 0) => {
  let sqlQry = `SELECT count(*) as count FROM repos WHERE name='${name}'`;
  if (id > 0) {
    sqlQry = `SELECT count(*) as count FROM repos WHERE name='${name}' AND id != ${id} `;
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

function validate(data) {
  const schema = {
    id: Joi.number()
      .min(0)
      .max(99999999999),
    name: Joi.string()
      .min(5)
      .max(55)
      .required(),
    url: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(data, schema);
}

module.exports.validate = validate;
module.exports.Repo = RepoModel;
