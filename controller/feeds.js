const db = require('../util/db');
const fullText = require('../api/fullText');
const huginn = require('../util/huginn');

async function getAllFeeds(req, res, next) {
  try {
    const data = await db.any('select * from feeds order by update_at desc limit 10');
    res.status(200)
      .json({
        status: 'success',
        data,
        message: 'Retrieved ALL Feeds',
      });
  } catch (error) {
    Error(error);
  }
}

function getSingleFeed(req, res, next) {
  const id = parseInt(req.params.id);
  db.one('select * from feeds where id = $1', id)
    .then((data) => {
      res.status(200)
        .json({
          status: 'success',
          data,
          message: `Retrieved feed ${id}`,
        });
    })
    .catch(err => next(err));
}

async function createFeed(req, res, next) {
  try {
    const dbResult = await db.one('insert into feeds(url, comment) values(${url}, ${comment}) returning id', req.body);
    res.status(200)
      .json({
        status: 'success',
        message: `Inserted feed ${dbResult.id} with fulltext extracted.`,
      });

    let text;
    if (req.body.fulltext) {
      text = await fullText.getTextViaMercury(dbResult.id, req.body.url);
    } else {
      text = await fullText.getTextViaMercury(dbResult.id, req.body.url);
    }
    const request = {
      id: dbResult.id,
      title: text.title,
      content: text.content,
    };
    updateFeedContent(request);
  } catch (error) {
    next(error);
  }
}

async function updateFeedContent(req) {
  try {
    await db.none('update feeds set content=$2 ,title=$3, update_at=now() where id=$1', [parseInt(req.id), req.content, req.title]);
  } catch (error) {
    Error(error);
  }
  huginn.triggerHuginn(req.title);
}


async function updateFeed(req, res, next) {
  try {
    await db.none('update feeds set content=$2 ,title=$3, update_at=now() where id=$1', [parseInt(req.id), req.content, req.title]);
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
    await db.result('delete from feeds where id = $1', parseInt(req.params.id));
    res.status(200)
      .json({
        status: 'success',
        message: `Removed feed ${parseInt(req.params.id)}`,
      });
  } catch (error) {
    next(err);
  }
}

module.exports = {
  getAllFeeds,
  getSingleFeed,
  createFeed,
  updateFeed,
  removeFeed,
};
