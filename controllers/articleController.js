const db = require('../models');

const fullText = require('../controllers/fullTextController');


async function getAllArticles(req, res) {
  try {
    const data = await db.Article.findAll();
    res.status(200)
      .json({
        status: 'success',
        data,
        message: 'Retrieved ALL Articles',
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
  // huginn.triggerHuginn(result.title);
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


// async function updateArticle(req, res) {
//   try {
//     await db.Article.update({
//       content: req.body.content,
//       title: req.body.title,
//     }, {
//       where: {
//         id: parseInt(req.body.id),
//       },
//     });

//     res.status(200)
//       .json({
//         status: 'success',
//         message: `Updated Article ${req.body.id}`,
//       });
//   } catch (error) {
//     Error(error);
//   }
// }


async function removeArticle(req, res) {
  try {
    await db.Article.destroy({
      where: {
        id: parseInt(req.params.id),
      },
    });

    res.status(200)
      .json({
        status: 'success',
        message: `Removed Article ${parseInt(req.params.id)}`,
      });
  } catch (error) {
    Error(error);
  }
}


module.exports = {
  getAllArticles,
  getSingleArticle,
  createArticle,
  extractArticleContent,
  // updateArticle,
  // removeArticle,
};
