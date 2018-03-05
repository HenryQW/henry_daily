const axios = require('axios');
const phantom = require('phantom');
const cheerio = require('cheerio');
const urlUtil = require('url');
const siteRules = require('../config/siteRules');

const {
  rules,
} = siteRules;

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

function generateSelector(url) {
  const {
    hostname,
  } = urlUtil.parse(url);

  for (let i = 0, len = rules.length; i < len; i++) {
    if (rules[i].hostname === hostname) {
      return {
        title: rules[i].title,
        content: rules[i].content,
        sanitiser: rules[i].sanitiser,
      };
    }
  }
}

async function startCheerioProcess(content, selector) {
  const $ = cheerio.load(content, {
    decodeEntities: false,
  });

  const title = $(selector.title).html().trim();

  selector.sanitiser.forEach((sanitiser) => {
    $(sanitiser).remove();
  });

  return {
    content: $(selector.content).html().trim(),
    title,
  };
}


async function getTextViaPhantomJS(id, url) {
  try {
    const selector = generateSelector(url);

    if (selector != null) {
      const instance = await phantom.create();
      const page = await instance.createPage();

      await page.open(url);
      const content = await page.property('content');

      page.close();
      instance.exit();
      const data = await startCheerioProcess(content, selector);
      return data;
    }
    return {
      title: 'selector is not defined',
    };
  } catch (error) {
    Error(error);
  }
  return null;
}

module.exports = {
  getTextViaMercury,
  getTextViaPhantomJS,
  generateSelector,
};
