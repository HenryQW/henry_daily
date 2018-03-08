const express = require('express');

const router = express.Router();
const feeds = require('../controller/feeds');
const passport = require('passport');

router.get('', feeds.getAllFeeds);
// router.get('/:id', feeds.getSingleFeed);
// router.post('/', passport.authenticate('localapikey'), feeds.createFeed);
// router.put('/:id', passport.authenticate('localapikey'), feeds.updateFeed);
// router.delete('/:id', passport.authenticate('localapikey'), feeds.removeFeed);
// router.get('/delete/:id', passport.authenticate('localapikey'), feeds.removeFeed);


module.exports = router;
