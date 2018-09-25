const { Repo, validate } = require('../models/repos');
// const connection = require('../middleware/db');

const RepoController = {};

/* CRUD operation START */

RepoController.list = async (req, res) => {
  let result = await Repo.list();
  if (result.length === 0) {
    result = 'No data available';
    return res.status(204).send(result);
  }
  return res.send(result);
};

RepoController.create = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isDuplicate = await Repo.isDuplicate(req.body.name, 0);

  if (isDuplicate[0].count > 0)
    return res
      .status(400)
      .send('Invalid Data - Repo with given name is already exists');

  const result = await Repo.create(req);
  return res.status(201).send(result);
};

RepoController.details = async (req, res) => {
  let result = await Repo.details(req);

  if (result.length === 0) {
    result = 'No data available';
    return res.status(404).send(result);
  }

  return res.send(result);
};

RepoController.update = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isDuplicate = await Repo.isDuplicate(req.body.name, req.params.id);
  if (isDuplicate[0].count > 0)
    return res
      .status(400)
      .send('Invalid Data - Repo with given name is already exists');

  let result = await Repo.update(req);

  if (result.affectedRows === 0) {
    result = 'No data available';
    return res.status(404).send(result);
  }

  return res.send(result);
};

RepoController.delete = async (req, res) => {
  let result = await Repo.delete(req);

  if (result.affectedRows === 0) {
    result = 'No data available';
    return res.status(404).send(result);
  }

  return res.send(result);
};

/* CRUD operation END */

module.exports = RepoController;
