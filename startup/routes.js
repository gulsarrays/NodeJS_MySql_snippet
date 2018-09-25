const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const path = require('path');

const indexRouter = require('../routes/index');
const eventsRouter = require('../routes/events');
const actorsRouter = require('../routes/actors');
const reposRouter = require('../routes/repos');
const eraseRouter = require('../routes/erase');

module.exports = app => {
  if (app.get('env') !== 'production') {
    app.use(logger('dev'));
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  // app.use(express.static(path.join(__dirname, '../public')));

  app.use('/', indexRouter);
  app.use('/events', eventsRouter);
  app.use('/actors', actorsRouter);
  app.use('/repos', reposRouter);
  app.use('/erase', eraseRouter);
};
