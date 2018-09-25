/* eslint-disable */

const { Actor, validate } = require('../../models/actors');
const connection = require('../../middleware/db');
const request = require('supertest');

let appServer;
const addActor = { login: 'actorLogin1', avatar_url: 'actorAvatarUrl1' };
const exec = async actorData =>
  await request(appServer)
    .post('/actors')
    .send(actorData);

describe('/actors', () => {
  /* Before Each test */
  beforeEach(async () => {
    appServer = require('../../app');
    await request(appServer).delete('/erase');
  });

  /* After Each test */
  afterEach(async () => {
    await request(appServer).delete('/erase');
  });

  describe('GET /actors', () => {
    it('/ :: should return 204 if No data available', async () => {
      const res = await request(appServer).get('/actors');

      expect(res.status).toBe(204);
      // expect(res.text).toBe('No data available');
    });

    it('/ :: should return list of actors', async () => {
      const result = await exec(addActor);

      const res = await request(appServer).get('/actors');
      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('login', 'actorLogin1');
    });

    it('/:id :: should return 404 for invalid id', async () => {
      const res = await request(appServer).get('/actors/11');

      expect(res.status).toBe(404);
      expect(res.text).toBe('No data available');
    });

    it('/:id :: should return 200 for valid id', async () => {
      const result = await exec(addActor);

      const res = await request(appServer).get('/actors/1');

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('login', 'actorLogin1');
    });
  });

  describe('POST /actors', () => {
    it('/ :: should return 400 if invalid input', async () => {
      const actor = { avatar_url: 'actorAvatarUrl1' };

      const res = await exec(actor);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*login.*/);
    });

    it('/ :: should return 400 if actor login is less than 5 char', async () => {
      const actor = { login: 'acto', avatar_url: 'actorAvatarUrl1' };

      const res = await exec(actor);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*login.*/);
    });

    it('/ :: should return 400 if actor login is greater than 55 char', async () => {
      const longString = new Array(57).join('a');
      const actor = { name: longString, avatar_url: 'actorAvatarUrl1' };

      const res = await exec(actor);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*login.*/);
    });

    it('/ :: should return 201 if valid input', async () => {
      const result = await exec(addActor);

      expect(result.status).toBe(201);
      expect(result.body).toHaveProperty('insertId', expect.any(Number));
      expect(result.body).toHaveProperty('affectedRows', 1);
    });

    it('/ :: should return 400 if duplicate login', async () => {
      const result = await exec(addActor);
      const res = await exec(addActor);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*already exists.*/);
    });
  });

  describe('UPDATE /actors/', () => {
    it('/ :: should return 404 for invalid id', async () => {
      const actor = {
        id: 11,
        login: 'actorLogin1-edit',
        avatar_url: 'actorAvatarUrl1-edit'
      };
      const res = await request(appServer)
        .put('/actors')
        .send(actor);
      expect(res.status).toBe(404);
    });

    it('/ :: should return 400 if id not provided', async () => {
      const actor = {
        avatar_url: 'actorAvatarUrl1-edit'
      };
      const res = await request(appServer)
        .put('/actors')
        .send(actor);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*provide the actorId.*/);
    });

    it('/ :: should return 400 if invalid input', async () => {
      const actor = {
        id: 11,
        avatar_url: 'actorAvatarUrl1-edit'
      };
      const res = await request(appServer)
        .put('/actors')
        .send(actor);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*login.*/);
    });

    it('/ :: should return 200 if valid input', async () => {
      const result = await exec(addActor);

      const actorEdit = {
        id: 1,
        login: 'actorLogin1-edit',
        avatar_url: 'actorAvatarUrl1-edit'
      };
      const res = await request(appServer)
        .put('/actors')
        .send(actorEdit);

      expect(res.status).toBe(200);

      const res1 = await request(appServer).get('/actors/1');

      expect(res1.status).toBe(200);
      expect(res1.body[0]).toHaveProperty('login', 'actorLogin1-edit');
    });

    it('/ :: should return 400 if duplicate login', async () => {
      const result1 = await exec(addActor);

      const actor2 = {
        login: 'actorLogin2',
        avatar_url: 'actorAvatarUrl2'
      };

      const result2 = await exec(actor2);

      const actorEdit = {
        id: 2,
        login: 'actorLogin1',
        avatar_url: 'actorAvatarUrl2 - edit'
      };
      const res = await request(appServer)
        .put('/actors')
        .send(actorEdit);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*already exists.*/);
    });
  });

  describe('DELETE /actors/:id', () => {
    it('/:id :: should return 404 for invalid id', async () => {
      const res = await request(appServer).delete('/actors/1');

      expect(res.status).toBe(404);
    });

    it('/:id :: should return 200 if valid input', async () => {
      const result = await exec(addActor);

      const res1 = await request(appServer).delete('/actors/1');

      expect(res1.status).toBe(200);
      expect(res1.body).toHaveProperty('affectedRows', 1);

      const res2 = await request(appServer).get('/actors/1');
      expect(res2.status).toBe(404);
    });
  });
});
