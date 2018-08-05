const express = require('express');

const router = express.Router();
const job = require('../../backend/controllers/JobController');


router.get('', job.getLastFiftyJobs);
router.post('/totaljob', job.totalJobAPI);
// router.put('/:id', article.updateArticle);
// router.delete('/:id', article.removeArticle);


module.exports = router;
