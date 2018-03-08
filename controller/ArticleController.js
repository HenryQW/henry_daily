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


async function updateArticleContent(id, url) {
  const result = await fullText.dispatch(url);
  try {
    await db.Article.update({
      content: result.content,
      title: result.title,
    }, {
      where: {
        _id: parseInt(id),
      },
    });
  } catch (error) {
    Error(error);
  }
  // huginn.triggerHuginn(result.title);
}

// TODO: convert methods

// async function createArticle(req, res, next) {
//   try {
//     const dbResult = await db.one(`insert into ${process.env.DB_FEEDS_TABLE} (url, comment) values ('${req.body.url}', '${req.body.comment}') returning id`);
//     // const dbResult = await db.one('insert into feeds(url, comment) values(${url}, ${comment}) returning id', req.body);

//     updateFeedContent(dbResult.id, req.body.url);

//     res.status(200)
//       .json({
//         status: 'success',
//         message: `Inserted Article ${dbResult.id}.`,
//       });
//   } catch (error) {
//     next(error);
//   }
// }


// async function updateArticle(req, res, next) {
//   try {
//     await db.none(`update ${process.env.DB_FEEDS_TABLE} set content='${req.params.content}' ,title='${req.params.title}', update_at=now() where id=${parseInt(req.params.id)}`);
//     res.status(200)
//       .json({
//         status: 'success',
//         message: `Updated Article ${req.body.id}`,
//       });
//   } catch (error) {
//     next(error);
//   }
// }


// async function removeArticle(req, res, next) {
//   try {
//     await db.result(`delete from ${process.env.DB_FEEDS_TABLE} where id = ${parseInt(req.params.id)}`);
//     res.status(200)
//       .json({
//         status: 'success',
//         message: `Removed Article ${parseInt(req.params.id)}`,
//       });
//   } catch (error) {
//     next(error);
//   }
// }


module.exports = {
  getAllArticles,
  getSingleArticle,
  updateArticleContent,
  // updateFeed,
  // removeFeed,
};
