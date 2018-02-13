const express = require('express');

const router = express.Router();
const feeds = require('../api/feeds');

router.get('/api/v1/feeds', feeds.getAllFeeds);
router.get('/api/v1/feeds/:id', feeds.getSingleFeed);
router.post('/api/v1/feeds', feeds.createFeed);
router.put('/api/v1/feeds/:id', feeds.updateFeed);
router.delete('/api/v1/feeds/:id', feeds.removeFeed);
router.get('/api/v1/feeds/delete/:id', feeds.removeFeed);

module.exports = router;
