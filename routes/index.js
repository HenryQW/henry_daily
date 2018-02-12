const express = require('express');

const router = express.Router();
const api = require('../api/feeds');

router.get('/api/v1/feeds', api.getAllFeeds);
router.get('/api/v1/feeds/:id', api.getSingleFeed);
router.post('/api/v1/feeds', api.createFeed);
router.put('/api/v1/feeds/:id', api.updateFeed);
router.delete('/api/v1/feeds/:id', api.removeFeed);
router.get('/api/v1/feeds/delete/:id', api.removeFeed);

module.exports = router;
