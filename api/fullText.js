const feeds = require('../api/feeds');
const axios = require('axios');
const phantom = require('phantom');
const cheerio = require('cheerio');
const Promise = require('promise');

const whiteList = ['36kr.com', 'qdaily.com', 'tmtpost.com', 'technode.com', 'sspai.com'];

const sites = {
  kr: {
    Name: '36kr.com',
    Path: 'section[class=textblock]',
  },
  Microsoft: {
    Name: 'Microsoft',
    ID: 'DEF',
  },
};

function getTextViaMercury(id, url) {
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

function getTextViaPhantomJS(id, url, selector) {
  return new Promise((resolve, reject) => {
    let _ph;
    let _page;
    phantom
      .create()
      .then((ph) => {
        _ph = ph;
        return _ph.createPage();
      })
      .then((page) => {
        _page = page;
        return _page.open(url);
      })
      .then(() => _page.property('content'))
      .then((content) => {
        _page.close();
        _ph.exit();
        const $ = cheerio.load(content, {
          decodeEntities: false,
        });
        return {
          content: $(selector).html(),
          title: $('h1').html(),
        };
      })
      .then((data) => {
        resolve(data.title);
        feeds.updateFeedInfo(id, data);
      })
      .catch(err => reject(err));
  });
}

module.exports = {
  getTextViaMercury,
  getTextViaPhantomJS,
};
