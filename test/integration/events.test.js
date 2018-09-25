/* eslint-disable */
const { Event } = require('../../models/events');
const { Actor } = require('../../models/actors');
const { Repo } = require('../../models/repos');
const connection = require('../../middleware/db');
const request = require('supertest');

let appServer;

const addEvent = {
  id: 4055191679,
  type: 'eventType1',
  actor: {
    id: 2790311,
    login: 'actorLogin1',
    avatar_url: 'actorAvatarUrl1'
  },
  repo: {
    id: 352806,
    name: 'repoName1',
    url: 'repoUrl1'
  },
  created_at: '2015-10-03 06:13:31'
};
const exec = async eventData => {
  return await request(appServer)
    .post('/events')
    .send(eventData);
};

describe('/events ', () => {
  /* Before Each test */
  beforeEach(async () => {
    appServer = require('../../app');
    await request(appServer).delete('/erase');
  });

  /* After Each test */
  afterEach(async () => {
    await request(appServer).delete('/erase');
  });

  describe('GET /events', () => {
    it('/ :: should return 204 if No data available', async () => {
      const res = await request(appServer).get('/events');

      expect(res.status).toBe(204);
      //expect(res.text).toBe('No data available');
    });

    it('/ :: should return list of events', async () => {
      const result = await exec(addEvent);

      const res = await request(appServer).get('/events');

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('id', expect.any(Number));
      expect(res.body[0]).toHaveProperty('type', expect.any(String));
      expect(res.body[0].actor).toHaveProperty('id', expect.any(Number));
      expect(res.body[0].actor).toHaveProperty('login', expect.any(String));
      expect(res.body[0].repo).toHaveProperty('id', expect.any(Number));
      expect(res.body[0].repo).toHaveProperty('name', expect.any(String));
    });

    it('/:id :: should return 404 for invalid id', async () => {
      const res = await request(appServer).get('/events/11');

      expect(res.status).toBe(404);
    });

    it('/:id :: should return 200 for valid id', async () => {
      const result = await exec(addEvent);

      const res = await request(appServer).get('/events/4055191679');

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('type', 'eventType1');
    });
  });

  describe('POST /events', () => {
    it('/ :: should return 400 if invalid input', async () => {
      const addEvent = {
        id: 4055191679,
        type: 'eventType1',
        repo: {
          id: 352806,
          name: 'repoName1',
          url: 'repoUrl1'
        },
        created_at: '2015-10-03 06:13:31'
      };
      const result = await exec(addEvent);

      expect(result.status).toBe(400);
      expect(result.text).toMatch(/.*"actor" is required.*/);
    });

    it('/ :: should return 400 if event type is less than 5 char', async () => {
      const event = {
        id: 4055191679,
        type: 'even',
        repo: {
          id: 352806,
          name: 'repoName1',
          url: 'repoUrl1'
        },
        created_at: '2015-10-03 06:13:31'
      };

      const res = await exec(event);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*type.*/);
    });

    it('/ :: should return 400 if event type is greater than 55 char', async () => {
      const longString = new Array(57).join('a');
      const event = {
        id: 4055191679,
        type: longString,
        repo: {
          id: 352806,
          name: 'repoName1',
          url: 'repoUrl1'
        },
        created_at: '2015-10-03 06:13:31'
      };

      const res = await exec(event);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*type.*/);
    });

    it('/ :: should return 201 if valid input', async () => {
      const result = await exec(addEvent);

      expect(result.status).toBe(201);
      expect(result.body).toHaveProperty('insertId', expect.any(Number));
      expect(result.body).toHaveProperty('affectedRows', 1);
    });

    it('/ :: should return 400 if duplicate  type and actor', async () => {
      const result = await exec(addEvent);
      const res = await exec(addEvent);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*already exists.*/);
    });
  });

  describe('UPDATE /events/:id', () => {
    it('/:id :: should return 404 for invalid id', async () => {
      const res = await request(appServer)
        .put('/events/1')
        .send(addEvent);

      expect(res.status).toBe(404);
    });

    it('/:id :: should return 400 if invalid input', async () => {
      const event = { actor: 1, repo: 1 };
      const res = await request(appServer)
        .put('/events/11')
        .send(event);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*type.*/);
    });

    it('/:id :: should return 200 if valid input', async () => {
      const result = await exec(addEvent);

      const eventEdit = {
        id: 4055191679,
        type: 'eventType1-edit',
        actor: {
          id: 2790311,
          login: 'actorLogin1',
          avatar_url: 'actorAvatarUrl1'
        },
        repo: {
          id: 352806,
          name: 'repoName1',
          url: 'repoUrl1'
        },
        created_at: '2015-10-03 06:13:31'
      };
      const res = await request(appServer)
        .put('/events/4055191679')
        .send(eventEdit);

      expect(res.status).toBe(200);

      const res1 = await request(appServer).get('/events/4055191679');

      expect(res1.status).toBe(200);
      expect(res1.body[0]).toHaveProperty('type', 'eventType1-edit');
    });

    it('/:id :: should return 400 if duplicate type', async () => {
      const addEvent = {
        id: 1,
        type: 'eventType1',
        actor: {
          id: 1,
          login: 'actorLogin1',
          avatar_url: 'actorAvatarUrl1'
        },
        repo: {
          id: 1,
          name: 'repoName1',
          url: 'repoUrl1'
        },
        created_at: '2015-10-03 06:13:31'
      };

      const result1 = await exec(addEvent);

      const event2 = {
        id: 2,
        type: 'eventType2',
        actor: {
          id: 2,
          login: 'actorLogin2',
          avatar_url: 'actorAvatarUrl2'
        },
        repo: {
          id: 2,
          name: 'repoName2',
          url: 'repoUrl2'
        },
        created_at: '2015-10-03 06:13:31'
      };
      const result = await exec(event2);

      const eventEdit = {
        id: 2,
        type: 'eventType1',
        actor: {
          id: 1,
          login: 'actorLogin2',
          avatar_url: 'actorAvatarUrl2'
        },
        repo: {
          id: 2,
          name: 'repoName2',
          url: 'repoUrl2'
        },
        created_at: '2015-10-03 06:13:31'
      };
      const res = await request(appServer)
        .put('/events/2')
        .send(eventEdit);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*already exists.*/);
    });
  });

  describe('DELETE /events/:id', () => {
    it('/:id :: should return 404 for invalid id', async () => {
      const res = await request(appServer).delete('/events/1');

      expect(res.status).toBe(404);
    });

    it('/:id :: should return 200 if valid input', async () => {
      const result = await exec(addEvent);

      const res1 = await request(appServer).delete('/events/4055191679');

      expect(res1.status).toBe(200);
      expect(res1.body).toHaveProperty('affectedRows', 1);

      const res2 = await request(appServer).get('/events/4055191679');

      expect(res2.status).toBe(404);
    });
  });

  describe('GET /actors/:id', () => {
    it('/ :: should return 404 if NOT found', async () => {
      const res = await request(appServer).get('/events/actors/11');

      expect(res.status).toBe(404);
      expect(res.text).toBe('No data available');
    });

    it('/ :: should return 200 for success', async () => {
      const result3 = await exec(addEvent);

      const res = await request(appServer).get('/events/actors/2790311');

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('id', expect.any(Number));
      expect(res.body[0]).toHaveProperty('type', expect.any(String));
      expect(res.body[0].actor).toHaveProperty('id', expect.any(Number));
      expect(res.body[0].actor).toHaveProperty('login', expect.any(String));
      expect(res.body[0].repo).toHaveProperty('id', expect.any(Number));
      expect(res.body[0].repo).toHaveProperty('name', expect.any(String));
    });
  });
});
