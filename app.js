require('dotenv').config();
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const passport = require('./backend/helpers/auth');

const article = require('./frontend/routes/ArticleRoute');
const job = require('./frontend/routes/JobRoute');
const siteRule = require('./frontend/routes/SiteRuleRoute');
const stat = require('./frontend/routes/StatRoute');
const dataCleaner = require('./frontend/routes/DataCleanerRoute');
const index = require('./frontend/routes/IndexRoute');

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'frontend', 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'frontend', 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

app.use(passport.initialize());
app.use(passport.session());
app.set('json spaces', 2);

app.use('/', index);
app.use('/api/v1/stat', stat);

app.use('/api/v1/article', passport.authenticate('localapikey'), article);
app.use('/api/v1/siterule', passport.authenticate('localapikey'), siteRule);
app.use('/api/v1/job', passport.authenticate('localapikey'), job);
app.use('/api/v1/clean', passport.authenticate('localapikey'), dataCleaner);

const statController = require('./backend/controllers/StatController');


const task = cron.schedule('0 0 * * *', async () => {
  const result = await statController.retrieveDockerHubStat(
    'https://registry.hub.docker.com/v2/repositories/wangqiru/ttrss/',
  );
  console.log(`Pull count: ${result.pull_count}`);
});

task.start();

const test = require('./backend/controllers/FullTextController');

test.getTextViaPhantomJS('https://www.totaljobs.com/job/junior-business-analyst/celsa-manufacturing-uk-ltd-job82229014');

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  if (process.env.NODE_ENV === 'production') {
    res.render('error', {
      error: err,
    });
  } else next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;