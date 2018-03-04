const feeds = require('../controller/feeds');
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

async function getTextViaMercury(id, url) {
  try {
    const res = await axios.get(`https://mercury.postlight.com/parser?url=${url}`, {
      headers: {
        'x-api-key': process.env.MERCURY,
      },
    });

    feeds.updateFeedInfo(id, res.data);
  } catch (error) {
    console.log(error);
  }
}

async function getTextViaPhantomJS(id, url, selector) {
  const instance = await phantom.create();
  const page = await instance.createPage();
  await page.on('onResourceRequested', (requestData) => {
    console.info('Requesting', requestData.url);
  });

  const status = await page.open(url);
  const content = await page.property('content');

  await instance.exit();

  const $ = cheerio.load(content, {
    decodeEntities: false,
  });

  const text = $(selector).html();
  const title = $('h1').html();
  return title;
  // feeds.updateFeedInfo(id, data);
}

module.exports = {
  getTextViaMercury,
  getTextViaPhantomJS,
};
