const express = require('express');

const router = express.Router();
const article = require('../controllers/ArticleController');
const passport = require('passport');

router.get('', article.getAllArticles);
router.get('/:id', article.getSingleArticle);
router.post('/', passport.authenticate('localapikey'), article.createArticle);
router.put('/:id', passport.authenticate('localapikey'), article.updateArticle);
router.delete('/:id', passport.authenticate('localapikey'), article.removeArticle);


module.exports = router;
