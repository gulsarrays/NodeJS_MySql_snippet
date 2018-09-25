/* eslint-disable */
const moment = require('moment');
const connection = require('../middleware/db');

const ActorStreakRepo = {};

const distinctEventDates = actorId =>
  new Promise((resolve, reject) => {
    connection.query(
      'SELECT DATE(`created_at`) AS dateonly FROM events where actor = ? GROUP BY DATE(`created_at`) order by dateonly ',
      actorId,
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          const unixDateArr = [];
          for (const date of results) {
            const unixDateFormat = moment(date.dateonly).format('X');
            unixDateArr.push(unixDateFormat);
          }
          resolve(unixDateArr);
        }
      }
    );
  });

const consecutiveDates = dateArray =>
  new Promise((resolve, reject) => {
    let i = 0;

    const consucetiveDateArr = [];

    const result = dateArray.reduce((stack, b) => {
      const cur = stack[i];

      const a = cur ? cur[cur.length - 1] : 0;

      if (b - a > 86400) {
        i++;
      }

      if (!stack[i]) stack[i] = [];
      stack[i].push(b);

      return stack;
    }, []);
    result.shift();

    if (result.length > 0) {
      for (const tempArr of result) {
        if (tempArr.length > 1) consucetiveDateArr.push(tempArr);
      }
      resolve(consucetiveDateArr);
    } else {
      reject(
        'Error!! Please check function consecutiveDates() in actorStreak repository.'
      );
    }
  });

const getEventsData = async (start, end, actorId) =>
  new Promise((resolve, reject) => {
    connection.query(
      'SELECT * FROM events WHERE actor=? and (DATE(created_at) BETWEEN ? AND ?) order by created_at',
      [actorId, start, end],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve({ data: results });
        }
      }
    );
  });

const consecutiveEventData = async (
  consecutiveDatesArr,
  actorId,
  actorDetailsArr
) => {
  const eventArr = [];
  const eventData = [];
  let eventCount = 0;
  for (const tmpArr of consecutiveDatesArr) {
    const start = moment.unix(tmpArr[0]).format('YYYY-MM-DD');
    const end = moment.unix(tmpArr[tmpArr.length - 1]).format('YYYY-MM-DD');
    const temp = await getEventsData(start, end, actorId);
    eventCount += temp.data.length;

    eventArr.push({
      streakLength: {
        start,
        end
      },
      data: temp.data
    });
  }
  eventData.push({
    actor: actorDetailsArr,
    // actorId: actorId,
    streak: consecutiveDatesArr.length,
    eventCount,
    events: eventArr
  });
  return eventData;
};

const getActorStreak = async () =>
  new Promise((resolve, reject) => {
    const actorStreak = [];
    connection.query(
      'SELECT distinct(e.actor) as actorId, a.login, a.avatar_url FROM events e, actors a WHERE e.actor = a.id',
      null,
      async (error, results) => {
        if (error) {
          reject(error);
        } else {
          for (const tempArr of results) {
            const actorDetailsArr = [];
            const actorId = tempArr.actorId;
            actorDetailsArr.push({
              id: tempArr.actorId,
              login: tempArr.login,
              avatar_url: tempArr.avatar_url
            });
            let distinctEventDatesArr = [];
            let consecutiveDatesArr = [];

            distinctEventDatesArr = await distinctEventDates(actorId);

            consecutiveDatesArr = await consecutiveDates(distinctEventDatesArr);
            actorStreak.push(
              await consecutiveEventData(
                consecutiveDatesArr,
                actorId,
                actorDetailsArr
              )
            );
          }

          const actorStreakOuput = [];
          for (const tmpArr of actorStreak) {
            if (tmpArr[0].events.length) actorStreakOuput.push(tmpArr[0]);
          }

          resolve(actorStreakOuput);
        }
      }
    );
  });

const getSortedScore = (obj, sortByKeyIndex) => {
  const keys = [];
  for (const key in obj[0]) keys.push(key);

  return obj.sort((a, b) => {
    for (let i in keys) {
      i = eval(i) + eval(sortByKeyIndex);
      const k = keys[i];

      if (a[k] - b[k] > 0) return -1;
      if (a[k] - b[k] < 0) return 1;
      continue;
    }
  });
};

ActorStreakRepo.streak = async (req, res) => {
  const actorStreak = await getActorStreak();

  if (actorStreak.length > 0) {
    const sortByKeyIndex = req.query.sortBy === 'event' ? 2 : 1;
    const sortedDataArr = getSortedScore(actorStreak, sortByKeyIndex);
    const sortedData = [];
    for (const tmpData of sortedDataArr) {
      sortedData.push(tmpData.actor[0]);
    }

    res.send(sortedData);
    return;
  }
  res.send('No Streaks are available');
};

module.exports.ActorStreakRepo = ActorStreakRepo;
