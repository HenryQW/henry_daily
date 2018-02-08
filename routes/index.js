var express = require('express');
var router = express.Router();
var passport = require('passport');

const api = require('../api/feeds');

router.get('/api/v1/feeds', api.getAllFeeds);
router.get('/api/v1/feeds/:id', api.getSingleFeed);
router.post('/api/v1/feeds', api.createFeed);
router.put('/api/v1/feeds/:id', api.updateFeed);
router.delete('/api/v1/feeds/:id', api.removeFeed);


module.exports = router;