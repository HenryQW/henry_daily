const express = require('express');

const router = express.Router();
const stat = require('../controllers/statController');

router.get('/rss', stat.getRSSStat);
router.get('/huginn', stat.getHuginnStat);
router.get('/dockerrss', stat.getDockerRSSStat);

module.exports = router;
