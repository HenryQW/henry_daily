const axios = require('axios');
const feeds = require('../api/feeds');
const Promise = require('promise');

function getMercuryText(id, url) {
  return new Promise((resolve, reject) => {
    axios.get(`https://mercury.postlight.com/parser?url=${url}`, {
      headers: {
        'x-api-key': process.env.MERCURY,
      },
    })
      .then((res) => {
        resolve(feeds.updateFeedInfo(id, res.data));
      })
      .catch(err => reject(err));
  });
}

module.exports = {
  getMercuryText,
};
