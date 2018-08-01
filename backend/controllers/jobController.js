const db = require('../models');
const urlUtil = require('url');
const puppeteer = require('puppeteer');

async function totalJobs(req, res) {
  try {
    const dbResult = await db.Article.create({
      url: req.body.url,
      comment: req.body.comment,
    });

    const result = await dispatch(req.body.url);

    res.status(200)
      .json(result);
  } catch (error) {
    Error(error);
  }
}

async function getTextViaPHeadlessChrome(url, title, company, location, salary, desc) {
  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint: 'ws://ip.wangqiru.com:3008',
    });
    const page = await browser.newPage();
    // await page.goto(url);
    const res = await page.goto('https://www.totaljobs.com/job/transport-planner-operations-assistant-suitable-for-graduates/the-human-group-north-east-limited-job82010985').then(a => console.log(a.$('.location .icon')));

    console.log(res);

    await browser.close();
  } catch (error) {
    Error(error);
  }
  return null;
}

async function dispatch(url) {
  const {
    hostname,
  } = urlUtil.parse(url);

  const selector = await siteRule.getSingleSiteRuleByHostname(hostname);

  if (selector === null) {
    return getTextViaMercury(url);
  }
  const content = await getTextViaPhantomJS(url);
  return startCheerioProcess(content, selector);
}

module.exports = {
  totalJobs,
};
