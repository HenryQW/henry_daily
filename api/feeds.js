const db = require('../util/db');
const fullText = require('./fullText');
const huginn = require('./huginn');

function getAllFeeds(req, res, next) {
  db.any('select * from feeds order by update_at desc limit 10')
    .then((data) => {
      res.status(200)
        .json({
          status: 'success',
          data,
          message: 'Retrieved ALL Feeds',
        });
    })
    .catch(err => next(err));
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

function createFeed(req, res, next) {
  db.one('insert into feeds(url, comment) values(${url}, ${comment}) returning id', req.body).then((data) => {
    if (req.body.fulltext) {
      fullText.getTextViaMercury(data.id, req.body.url).then(() => {
        res.status(200)
          .json({
            status: 'success',
            message: `Inserted feed ${data.id} with fulltext extracted.`,
          });
      });
    } else {
      res.status(200)
        .json({
          status: 'success',
          message: `Inserted feed ${data.id}.`,
        });
    }
  })
    .catch(err => next(err));
}


function updateFeedInfo(id, data) {
  console.info('update');
  db.none('update feeds set content=$2 ,title=$3, update_at=now() where id=$1', [parseInt(id), data.content, data.title])
    .then(() => {
      huginn.triggerHuginn(data.title);
    })
    .catch((err) => {
      console.log(error);
    });
}

function updateFeed(req, res, next) {
  db.none('update feeds set content=$2 where id=$1', [parseInt(req.params.id), req.body.content])
    .then(() => {
      res.status(200)
        .json({
          status: 'success',
          message: `Updated feed ${req.body.id}`,
        });
    })
    .catch(err => next(err));
}

function removeFeed(req, res, next) {
  const id = parseInt(req.params.id);
  db.result('delete from feeds where id = $1', id)
    .then(() => {
      res.status(200)
        .json({
          status: 'success',
          message: `Removed feed ${id}`,
        });
    })
    .catch(err => next(err));
}

module.exports = {
  getAllFeeds,
  getSingleFeed,
  createFeed,
  updateFeed,
  removeFeed,
  updateFeedInfo,
};
