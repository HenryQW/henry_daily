const db = require('../util/db');
const axios = require('axios');

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
  db.one('insert into feeds(url, comment)' + 'values(${url}, ${comment}) returning id', req.body).then((data) => {
    getFullText(data.id, req.body.url);
    res.status(200)
      .json({
        status: 'success',
        message: `Inserted feed ${data.id}`,
      });
  })
    .catch(err => next(err));
}


function updateFeedInfo(id, data) {
  db.none('update feeds set content=$2 ,title=$3, update_at=now() where id=$1', [parseInt(id), data.content, data.title])
    .then(() => {
      triggerHuginn(data.title);
    })
    .catch((err) => {
      console.log(error);
    });
}

function getFullText(id, url) {
  axios.get(`https://mercury.postlight.com/parser?url=${url}`, {
    headers: {
      'x-api-key': process.env.MERCURY,
    },
  })
    .then((res) => {
      updateFeedInfo(id, res.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function triggerHuginn(title) {
  axios.post(process.env.HUGINN_RSS, {
    title,
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
