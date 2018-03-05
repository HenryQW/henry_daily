const express = require('express');

const router = express.Router();
const feeds = require('../controller/feeds');
const fulltext = require('../controller/fullText');
const passport = require('passport');

router.get('/api/v1/feeds', feeds.getAllFeeds);
router.get('/api/v1/feeds/:id', feeds.getSingleFeed);
router.post('/api/v1/feeds', passport.authenticate('localapikey'), feeds.createFeed);
router.put('/api/v1/feeds/:id', passport.authenticate('localapikey'), feeds.updateFeed);
router.delete('/api/v1/feeds/:id', passport.authenticate('localapikey'), feeds.removeFeed);
router.get('/api/v1/feeds/delete/:id', passport.authenticate('localapikey'), feeds.removeFeed);


router.get('/', async (req, res, next) => {
  const data = await fulltext.generateSelector('https://cn.technode.com/post/2018-03-05/jingchi-baidu-apollo/');

  res.render('index', {
    title: data.title + data.content,
  });
});


module.exports = router;
