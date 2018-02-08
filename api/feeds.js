const db = require('../database');

function getAllFeeds(req, res, next) {
  db.any('SELECT * FROM feeds ORDER BY create_at DESC LIMIT 10')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL Feeds'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleFeed(req, res, next) {
  var id = parseInt(req.params.id);
  db.one('select * from feeds where id = $1', id)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: `Retrieved feed ${id}`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createFeed(req, res, next) {
  db.none('insert into feeds(url, content, comment)' +
      'values(${url}, ${content}, ${comment})',
      req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one feed'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateFeed(req, res, next) {
  db.none('update feeds set id=$1, url=$2, content=$3, comment=$4', [parseInt(req.params.id), req.body.url, req.body.content, req.body.comment])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: `Updated feed ${req.body.id}`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeFeed(req, res, next) {
  var id = parseInt(req.params.id);
  db.result('delete from feeds where id = $1', id)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed feed ${id}`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAllFeeds: getAllFeeds,
  getSingleFeed: getSingleFeed,
  createFeed: createFeed,
  updateFeed: updateFeed,
  removeFeed: removeFeed
};