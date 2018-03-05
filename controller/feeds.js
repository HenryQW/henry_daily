const db = require('../helper/db');
const fullText = require('../controller/fullText');
const huginn = require('../helper/huginn');


async function getAllFeeds(req, res, next) {
  try {
    const data = await db.any(`select * from ${process.env.DB_FEEDS_TABLE} order by update_at desc limit 10`);
    res.status(200)
      .json({
        status: 'success',
        data,
        message: 'Retrieved ALL Feeds',
      });
  } catch (error) {
    next(error);
  }
}


async function getSingleFeed(req, res, next) {
  try {
    const data = await db.one(`select * from ${process.env.DB_FEEDS_TABLE} where id = ${parseInt(req.params.id)}`);
    res.status(200)
      .json({
        status: 'success',
        data,
        message: `Retrieved feed ${parseInt(req.params.id)}`,
      });
  } catch (error) {
    next(error);
  }
}


async function updateFeedContent(id, url) {
  const result = await fullText.dispatch(url);
  try {
    await db.none(`update ${process.env.DB_FEEDS_TABLE} set content='${result.content}' ,title='${result.title}', update_at=now() where id=${parseInt(id)}`);
  } catch (error) {
    Error(error);
  }
  huginn.triggerHuginn(result.title);
}


async function createFeed(req, res, next) {
  try {
    const dbResult = await db.one(`insert into ${process.env.DB_FEEDS_TABLE} (url, comment) values ('${req.body.url}', '${req.body.comment}') returning id`);
    // const dbResult = await db.one('insert into feeds(url, comment) values(${url}, ${comment}) returning id', req.body);

    updateFeedContent(dbResult.id, req.body.url);

    res.status(200)
      .json({
        status: 'success',
        message: `Inserted feed ${dbResult.id}.`,
      });
  } catch (error) {
    next(error);
  }
}


async function updateFeed(req, res, next) {
  try {
    await db.none(`update ${process.env.DB_FEEDS_TABLE} set content='${req.params.content}' ,title='${req.params.title}', update_at=now() where id=${parseInt(req.params.id)}`);
    res.status(200)
      .json({
        status: 'success',
        message: `Updated feed ${req.body.id}`,
      });
  } catch (error) {
    next(error);
  }
}


async function removeFeed(req, res, next) {
  try {
    await db.result(`delete from ${process.env.DB_FEEDS_TABLE} where id = ${parseInt(req.params.id)}`);
    res.status(200)
      .json({
        status: 'success',
        message: `Removed feed ${parseInt(req.params.id)}`,
      });
  } catch (error) {
    next(error);
  }
}


module.exports = {
  getAllFeeds,
  getSingleFeed,
  createFeed,
  updateFeed,
  removeFeed,
};
