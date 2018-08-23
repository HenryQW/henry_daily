const express = require('express');

const router = express.Router();
const article = require('../controllers/articleController');

router.get('', article.getLastTenArticles);
router.get('/:id', article.getSingleArticle);
router.post('/', article.createArticle);

module.exports = router;
