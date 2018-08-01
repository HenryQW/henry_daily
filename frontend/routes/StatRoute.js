const express = require('express');

const router = express.Router();
const stat = require('../../backend/controllers/StatController');

router.get('/rss', stat.getRSSStat);
router.get('/huginn', stat.getHuginnStat);
router.get('/docker', stat.getDockerHubStat);

module.exports = router;
