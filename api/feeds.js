const db = require('../db');

function getAllFeeds(req, res, next) {
  db.any('select * from feeds order by create_at desc limit 10')
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
  db.none(
    'insert into feeds(url, content, comment)' +
      'values(${url}, ${content}, ${comment})',
    req.body,
  )
    .then(() => {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one feed',
        });
    })
    .catch(err => next(err));
}

function updateFeed(req, res, next) {
  db.none('update feeds set id=$1, url=$2, content=$3, comment=$4', [parseInt(req.params.id), req.body.url, req.body.content, req.body.comment])
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
    .then((result) => {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed feed ${id}`,
        });
      /* jshint ignore:end */
    })
    .catch(err => next(err));
}

module.exports = {
  getAllFeeds,
  getSingleFeed,
  createFeed,
  updateFeed,
  removeFeed,
};
