const express = require('express');

const router = express.Router();
const feeds = require('../controller/feeds');
const fulltext = require('../api/fullText');
const passport = require('passport');

router.get('/api/v1/feeds', feeds.getAllFeeds);
router.get('/api/v1/feeds/:id', feeds.getSingleFeed);
router.post('/api/v1/feeds', passport.authenticate('localapikey'), feeds.createFeed);
router.put('/api/v1/feeds/:id', passport.authenticate('localapikey'), feeds.updateFeed);
router.delete('/api/v1/feeds/:id', passport.authenticate('localapikey'), feeds.removeFeed);
router.get('/api/v1/feeds/delete/:id', passport.authenticate('localapikey'), feeds.removeFeed);

const sites = {
  kr: {
    Name: '36kr.com',
    Path: 'section[class=textblock]',
  },
  Microsoft: {
    Name: 'Microsoft',
    ID: 'DEF',
  },
};

router.get('/', (req, res, next) => {
  const data = fulltext.getTextViaPhantomJS(67, 'http://36kr.com/p/5119669.html', sites.kr.Path);

  res.render('index', {
    title: data,
  });
});


module.exports = router;
