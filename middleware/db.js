const mysql = require('mysql');
const config = require('config');

const connection = mysql.createConnection({
  host: config.get('dbHost'),
  user: config.get('dbUser'),
  password: config.get('dbPass'),
  database: config.get('dbName')
});
connection.connect(err => {
  if (!err) {
    console.log('Database is connected');
  } else {
    console.log('Error while connecting with database');
  }
});
module.exports = connection;
