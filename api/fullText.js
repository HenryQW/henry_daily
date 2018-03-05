const axios = require('axios');
const phantom = require('phantom');
const cheerio = require('cheerio');

const whiteList = ['36kr.com', 'qdaily.com', 'tmtpost.com', 'technode.com', 'sspai.com'];

const sites = {
  kr: {
    name: '36kr.com',
    title: 'h1',
    content: 'section[class=textblock]',
  },
};

async function getTextViaMercury(id, url) {
  try {
    const res = await axios.get(`https://mercury.postlight.com/parser?url=${url}`, {
      headers: {
        'x-api-key': process.env.MERCURY,
      },
    });
    return res.data;
  } catch (error) {
    Error(error);
  }
  return null;
}

async function getTextViaPhantomJS(id, url, selector) {
  try {
    const instance = await phantom.create();
    const page = await instance.createPage();

    await page.open(url);
    const content = await page.property('content');

    page.close();
    instance.exit();

    const $ = cheerio.load(content, {
      decodeEntities: false,
    });

    const data = {
      content: $(selector.content).html(),
      title: $(selector.title).html(),
    };

    return data;
  } catch (error) {
    Error(error);
  }
  return null;
}

module.exports = {
  getTextViaMercury,
  getTextViaPhantomJS,
};
