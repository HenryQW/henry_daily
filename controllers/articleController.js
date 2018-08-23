const db = require('../models');

const fullText = require('./fullTextController');

async function getLastTenArticles(req, res) {
  try {
    const data = await db.Article.findAll({
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
      ],
    });
    res.status(200)
      .json({
        status: 'success',
        data,
        message: 'Retrieved Last 10 Articles',
      });
  } catch (error) {
    Error(error);
  }
}


async function getSingleArticle(req, res) {
  try {
    const data = await db.Article.findById(parseInt(req.params.id));
    res.status(200)
      .json({
        status: 'success',
        data,
        message: `Retrieved Article ${parseInt(req.params.id)}`,
      });
  } catch (error) {
    Error(error);
  }
}


async function extractArticleContent(id, url) {
  const result = await fullText.dispatch(url);
  try {
    await db.Article.update({
      content: result.content.trim().replace(/\r?\n|\r/g, ' '),
      title: result.title,
    }, {
      where: {
        id: parseInt(id),
      },
    });
  } catch (error) {
    Error(error);
  }
}

async function createArticle(req, res) {
  try {
    const dbResult = await db.Article.create({
      url: req.body.url,
      comment: req.body.comment,
    });

    extractArticleContent(dbResult.id, req.body.url);

    res.status(200)
      .json({
        status: 'success',
        message: `Inserted Article ${dbResult.id}.`,
      });
  } catch (error) {
    Error(error);
  }
}

module.exports = {
  getLastTenArticles,
  getSingleArticle,
  createArticle,
};