/* eslint-disable */
const EraseController = require('../../controllers/eraseController');
const { Repo } = require('../../models/repos');

const connection = require('../../middleware/db');
const request = require('supertest');

let appServer;

describe('/erase ', () => {
  /* Before Each test */
  beforeEach(() => {
    appServer = require('../../app');
  });

  /* After Each test */
  afterEach(async () => {
    await request(appServer).delete('/erase');
  });

  it('/ :: should return 200 for success', async () => {
    const res = await request(appServer).delete('/erase');
    expect(res.status).toBe(200);

    const res1 = await request(appServer).get('/repos');
    expect(res1.status).toBe(204);

    const res2 = await request(appServer).get('/actors');
    expect(res2.status).toBe(204);

    const res3 = await request(appServer).get('/events');
    expect(res3.status).toBe(204);
  });
});
