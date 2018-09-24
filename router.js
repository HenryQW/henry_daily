const express = require('express');

const router = express.Router();
const passport = require('./middlewares/auth');

router.use(passport.initialize());
router.use(passport.session());

router.use('/', require('./routes/IndexRoute'));
router.use('/api/v1/stat', require('./routes/StatRoute'));

const article = require('./routes/ArticleRoute');

router.use('/api/v1/article', passport.authenticate('localapikey'), article);
router.post('/api/v1/article', passport.authenticate('localapikey'), article);

const siteRule = require('./routes/SiteRuleRoute');

router.use('/api/v1/siterule', passport.authenticate('localapikey'), siteRule);
router.post('/api/v1/siterule', passport.authenticate('localapikey'), siteRule);

const job = require('./routes/JobRoute');

router.use('/api/v1/job', passport.authenticate('localapikey'), job);
router.post('/api/v1/job', passport.authenticate('localapikey'), job);

router.use('/api/v1/clean', passport.authenticate('localapikey'), require('./routes/DataCleanerRoute'));

const rail = require('./routes/RailRoute');

router.use('/api/v1/rail', passport.authenticate('localapikey'), rail);


module.exports = router;
