const express = require('express');

const router = express.Router();
const job = require('../controllers/jobController');

router.get('', job.getLastFiftyJobs);
router.post('/totaljob', job.totalJobAPI);

module.exports = router;
