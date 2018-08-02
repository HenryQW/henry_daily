const urlUtil = require('url');
const puppeteer = require('puppeteer');
const db = require('../models');

const args = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-infobars',
  '--window-position=0,0',
  '--ignore-certifcate-errors',
  '--ignore-certifcate-errors-spki-list',
  '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
];

const options = {
  args,
  headless: true,
  ignoreHTTPSErrors: true,
  userDataDir: './tmp',
};

async function totalJobs(req, res) {
  try {
    const dbResult = await db.Job.create({
      jobId: req.body.jobId,
      url: req.body.url,
    });

    getTotalJobContent(req.body.url);

    res.status(200)
      .json({
        status: 'success',
        message: `Inserted Job ${dbResult.id}.`,
      });
  } catch (error) {
    Error(error);
  }
}

async function getTotalJobContent(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://www.totaljobs.com/job/transport-planner/spider-web-recruitment-ltd-job82491358');
    // await page.goto('https://google.com');


    const salary = await page.evaluate(() => document.querySelector('.salary.icon div').innerText);

    const json = await page.$eval('script[type="application/ld+json"]', el => el.text);

    const result = JSON.parse(json);

    await browser.close();

    const location = result.jobLocation.addressLocality + result.jobLocation.postalCode;

    await db.Job.update({
      hostname: urlUtil.parse(url),
      title: result.title,
      company: result.hiringOrganization.name,
      salary,
      location,
      desc: result.description,
    }, {
      where: {
        url,
      },
    });
  } catch (error) {
    Error(error);
  }
  return null;
}

module.exports = {
  totalJobs,
  getTotalJobContent,
};
