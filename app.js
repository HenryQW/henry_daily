require('dotenv').config();
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cron = require('node-cron');

const app = express();

const router = require('./router');
const errorHandler = require('./middlewares/raven');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('json spaces', 2);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(router);

app.use(errorHandler);

const statController = require('./controllers/statController');

const task = cron.schedule('0 0 * * *', async () => {
    await statController.retrieveDockerHubStat(
        'https://registry.hub.docker.com/v2/repositories/wangqiru/ttrss/'
    );
});

task.start();

module.exports = app;
