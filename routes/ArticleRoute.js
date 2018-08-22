const express = require('express');

const router = express.Router();
const article = require('../controllers/articleController');

router.get('', article.getLastTenArticles);
router.get('/:id', article.getSingleArticle);
router.post('/', article.createArticle);
// router.put('/:id', article.updateArticle);
// router.delete('/:id', article.removeArticle);

module.exports = router;
