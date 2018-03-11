const db = require('../models');

const fullText = require('../controller/fullText');
const huginn = require('../helper/huginn');


async function getAllArticles(req, res, next) {
  try {
    const data = await db.Article.findAll();
    res.status(200)
      .json({
        status: 'success',
        data,
        message: 'Retrieved ALL Articles',
      });
  } catch (error) {
    next(error);
  }
}


async function getSingleArticle(req, res, next) {
  try {
    const data = await db.Article.findById(parseInt(req.params.id));
    res.status(200)
      .json({
        status: 'success',
        data,
        message: `Retrieved Article ${parseInt(req.params.id)}`,
      });
  } catch (error) {
    next(error);
  }
}


async function extractArticleContent(id, url) {
  const result = await fullText.dispatch(url);
  try {
    await db.Article.update({
      content: result.content,
      title: result.title,
    }, {
      where: {
        id: parseInt(id),
      },
    });
  } catch (error) {
    Error(error);
  }
  // huginn.triggerHuginn(result.title);
}

async function createArticle(req, res, next) {
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
    next(error);
  }
}


async function updateArticle(req, res, next) {
  try {
    await db.Article.update({
      content: req.params.content,
      title: req.params.title,
    }, {
      where: {
        id: parseInt(id),
      },
    });

    res.status(200)
      .json({
        status: 'success',
        message: `Updated Article ${req.body.id}`,
      });
  } catch (error) {
    next(error);
  }
}


async function removeArticle(req, res, next) {
  try {
    await db.Article.destroy({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200)
      .json({
        status: 'success',
        message: `Removed Article ${parseInt(req.params.id)}`,
      });
  } catch (error) {
    next(error);
  }
}


module.exports = {
  getAllArticles,
  getSingleArticle,
  createArticle,
  extractArticleContent,
  updateArticle,
  removeArticle,
};
