const express = require('express');

const router = express.Router();
const passport = require('./middlewares/auth');
const article = require('./routes/ArticleRoute');
const job = require('./routes/JobRoute');
const siteRule = require('./routes/SiteRuleRoute');
const stat = require('./routes/StatRoute');
const dataCleaner = require('./routes/DataCleanerRoute');
const index = require('./routes/IndexRoute');

router.use(passport.initialize());
router.use(passport.session());

router.use('/', index);
router.use('/api/v1/stat', stat);
router.use('/api/v1/article', passport.authenticate('localapikey'), article);
router.use('/api/v1/siterule', passport.authenticate('localapikey'), siteRule);
router.use('/api/v1/job', passport.authenticate('localapikey'), job);
router.use('/api/v1/clean', passport.authenticate('localapikey'), dataCleaner);

module.exports = router;
