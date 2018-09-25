/* eslint-disable */
const { Event } = require('../../../models/events');
const connection = require('../../../middleware/db');
const request = require('supertest');

let appServer;

const addEventsArr = [
  {
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
    created_at: '2018-09-11 17:51:03'
  },
  {
    id: 2,
    type: 'eventType2',
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
    created_at: '2018-09-12 17:51:03'
  },
  {
    id: 3,
    type: 'eventType3',
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
    created_at: '2018-09-13 17:51:03'
  },
  {
    id: 4,
    type: 'eventType4',
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
    created_at: '2018-09-19 17:51:03'
  },
  {
    id: 5,
    type: 'eventType5',
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
    created_at: '2018-09-20 17:51:03'
  },
  {
    id: 6,
    type: 'eventType6',
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
    created_at: '2018-09-11 17:51:03'
  },
  {
    id: 7,
    type: 'eventType7',
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
    created_at: '2018-09-12 17:51:03'
  },
  {
    id: 8,
    type: 'eventType8',
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
    created_at: '2018-09-13 17:51:03'
  },
  {
    id: 9,
    type: 'eventType9',
    actor: {
      id: 3,
      login: 'actorLogin3',
      avatar_url: 'actorAvatarUrl3'
    },
    repo: {
      id: 1,
      name: 'repoName1',
      url: 'repoUrl1'
    },
    created_at: '2018-09-02 17:51:03'
  },
  {
    id: 10,
    type: 'eventType10',
    actor: {
      id: 3,
      login: 'actorLogin3',
      avatar_url: 'actorAvatarUrl3'
    },
    repo: {
      id: 1,
      name: 'repoName1',
      url: 'repoUrl1'
    },
    created_at: '2018-09-03 17:51:03'
  },
  {
    id: 11,
    type: 'eventType11',
    actor: {
      id: 3,
      login: 'actorLogin3',
      avatar_url: 'actorAvatarUrl3'
    },
    repo: {
      id: 1,
      name: 'repoName1',
      url: 'repoUrl1'
    },
    created_at: '2018-09-15 17:51:03'
  },
  {
    id: 12,
    type: 'eventType12',
    actor: {
      id: 3,
      login: 'actorLogin3',
      avatar_url: 'actorAvatarUrl3'
    },
    repo: {
      id: 1,
      name: 'repoName1',
      url: 'repoUrl1'
    },
    created_at: '2018-09-16 17:51:03'
  },
  {
    id: 13,
    type: 'eventType13',
    actor: {
      id: 3,
      login: 'actorLogin3',
      avatar_url: 'actorAvatarUrl3'
    },
    repo: {
      id: 1,
      name: 'repoName1',
      url: 'repoUrl1'
    },
    created_at: '2018-09-24 17:51:03'
  },
  {
    id: 14,
    type: 'eventType14',
    actor: {
      id: 3,
      login: 'actorLogin3',
      avatar_url: 'actorAvatarUrl3'
    },
    repo: {
      id: 1,
      name: 'repoName1',
      url: 'repoUrl1'
    },
    created_at: '2018-09-25 17:51:03'
  },
  {
    id: 15,
    type: 'eventType15',
    actor: {
      id: 3,
      login: 'actorLogin3',
      avatar_url: 'actorAvatarUrl3'
    },
    repo: {
      id: 1,
      name: 'repoName1',
      url: 'repoUrl1'
    },
    created_at: '2018-09-29 17:51:03'
  },
  {
    id: 16,
    type: 'eventType16',
    actor: {
      id: 4,
      login: 'actorLogin4',
      avatar_url: 'actorAvatarUrl4'
    },
    repo: {
      id: 1,
      name: 'repoName1',
      url: 'repoUrl1'
    },
    created_at: '2018-10-02 17:51:03'
  },
  {
    id: 17,
    type: 'eventType17',
    actor: {
      id: 4,
      login: 'actorLogin4',
      avatar_url: 'actorAvatarUrl4'
    },
    repo: {
      id: 1,
      name: 'repoName1',
      url: 'repoUrl1'
    },
    created_at: '2018-10-06 17:51:03'
  },
  {
    id: 18,
    type: 'eventType18',
    actor: {
      id: 4,
      login: 'actorLogin4',
      avatar_url: 'actorAvatarUrl4'
    },
    repo: {
      id: 1,
      name: 'repoName1',
      url: 'repoUrl1'
    },
    created_at: '2018-10-09 17:51:03'
  }
];

const exec = async eventData => {
  return await request(appServer)
    .post('/events')
    .send(eventData);
};

describe('/events ', () => {
  /* Before Each test */
  beforeEach(async () => {
    appServer = require('../../../app');
    await request(appServer).delete('/erase');
  });

  /* After Each test */
  afterEach(async () => {
    await request(appServer).delete('/erase');
  });

  it('should not get streak when table is empty ', async () => {
    let count = 0;
    for (let addEvent of addEventsArr) {
      count++;
      if (count > 2) {
        break;
      }
      let result = await exec(addEvent);
    }

    const erase = Event.erase();
    const res = await request(appServer).get('/actors/streak');
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/.*No Streaks.*/);
  });

  it('should get no streak if no cosecutive events for any actor ', async () => {
    const addEvent1 = {
      type: 'eventType1',
      actor: 1,
      repo: 1,
      created_at: '2018-09-11 17:51:03'
    };
    const addEvent2 = {
      type: 'eventType2',
      actor: 1,
      repo: 1,
      created_at: '2018-09-13 17:51:03'
    };
    const result1 = await exec(addEvent1);
    const result2 = await exec(addEvent2);

    const res = await request(appServer).get('/actors/streak');
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/.*No Streaks.*/);
  });

  it('should get actor streak as expected', async () => {
    for (let addEvent of addEventsArr) {
      let result = await exec(addEvent);
    }
    const res = await request(appServer).get('/actors/streak');
    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty('id', 3);
    expect(res.body[0]).toHaveProperty('login', 'actorLogin3');
    expect(res.body[0]).toHaveProperty('avatar_url', 'actorAvatarUrl3');

    expect(res.body[1]).toHaveProperty('id', 1);
    expect(res.body[1]).toHaveProperty('login', 'actorLogin1');
    expect(res.body[1]).toHaveProperty('avatar_url', 'actorAvatarUrl1');
  });

  it('should not include the actor details who does not have consecutive events', async () => {
    for (let addEvent of addEventsArr) {
      let result = await exec(addEvent);
    }
    const res = await request(appServer).get('/actors/streak');
    expect(res.status).toBe(200);
    expect(res.body[2]).toBeFalsy();
  });

  it('should sort the streak as per streak count', async () => {
    for (let addEvent of addEventsArr) {
      let result = await exec(addEvent);
    }
    const res = await request(appServer).get('/actors/streak');
    expect(res.status).toBe(200);

    expect(res.body[0]).toHaveProperty('id', 3);
    expect(res.body[0]).toHaveProperty('login', 'actorLogin3');
    expect(res.body[0]).toHaveProperty('avatar_url', 'actorAvatarUrl3');

    expect(res.body[1]).toHaveProperty('id', 1);
    expect(res.body[1]).toHaveProperty('login', 'actorLogin1');
    expect(res.body[1]).toHaveProperty('avatar_url', 'actorAvatarUrl1');
  });

  it('should sort the streak as per event count', async () => {
    for (let addEvent of addEventsArr) {
      let result = await exec(addEvent);
    }
    const res = await request(appServer).get('/actors/streak?sortBy=event');
    expect(res.status).toBe(200);
    expect(res.body[1]).toHaveProperty('id', 3);
    expect(res.body[1]).toHaveProperty('login', 'actorLogin3');
    expect(res.body[1]).toHaveProperty('avatar_url', 'actorAvatarUrl3');

    expect(res.body[0]).toHaveProperty('id', 1);
    expect(res.body[0]).toHaveProperty('login', 'actorLogin1');
    expect(res.body[0]).toHaveProperty('avatar_url', 'actorAvatarUrl1');
  });
});
