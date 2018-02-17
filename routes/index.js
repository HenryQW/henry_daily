const express = require('express');

const router = express.Router();
const feeds = require('../api/feeds');
const full = require('../api/fullText');
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
  // full.
  full.getTextViaPhantomJS(67, 'http://36kr.com/p/5119669.html?ktm_source=feed', sites.kr.Path).then((data) => {
    res.render('index', {
      title: data,
    });
  });
});


module.exports = router;
