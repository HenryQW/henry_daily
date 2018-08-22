const express = require('express');

const router = express.Router();
const job = require('../controllers/jobController');

router.get('', job.getLastFiftyJobs);
router.post('/totaljob', job.totalJobAPI);
// router.put('/:id', article.updateArticle);
// router.delete('/:id', article.removeArticle);

module.exports = router;
