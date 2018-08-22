require('dotenv').config();
const express = require('express');
const Raven = require('raven');
const git = require('git-rev-sync');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cron = require('node-cron');

const app = express();

Raven.config('https://630689efc9aa403f86819d6520a03fb0@sentry.io/1267129', {
  release: git.long(),
}).install();

app.use(require('./router'));

app.use(Raven.requestHandler());
app.use(Raven.errorHandler());

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('json spaces', 2);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const statController = require('./controllers/statController');

const task = cron.schedule('0 0 * * *', async () => {
  const result = await statController.retrieveDockerHubStat(
    'https://registry.hub.docker.com/v2/repositories/wangqiru/ttrss/',
  );
  console.log(`Pull count: ${result.pull_count}`);
});

task.start();

app.get('*', (req, res) => {
  const err = new Error('Not Found');
  err.status = 404;
  Raven.captureException(err, () => {
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
});

module.exports = app;
