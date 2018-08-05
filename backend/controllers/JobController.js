const urlUtil = require('url');
const puppeteer = require('puppeteer');
const db = require('../models');

// const args = [
//   '--no-sandbox',
//   '--disable-setuid-sandbox',
//   '--disable-infobars',
//   '--window-position=0,0',
//   '--ignore-certifcate-errors',
//   '--ignore-certifcate-errors-spki-list',
//   '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko)',
// ];

// const options = {
//   args,
//   headless: true,
//   ignoreHTTPSErrors: true,
//   userDataDir: './tmp',
// };


async function createJob(url, title, jobId) {
  const {
    hostname,
  } = urlUtil.parse(url);

  const dbResult = await db.Job.create({
    jobId,
    url,
    title,
    hostname,
  });

  return dbResult;
}


async function updateJob(result, id) {
  await db.Job.update({
    company: result.company,
    salary: result.salary,
    location: result.location,
    desc: result.desc,
  }, {
    where: {
      id,
    },
  });
}

async function getLastFiftyJobs(req, res) {
  try {
    const data = await db.Job.findAll({
      limit: 50,
      order: [
        ['createdAt', 'DESC'],
      ],
    });
    res.status(200)
      .json({
        status: 'success',
        data,
        message: 'Retrieved Last 50 Articles',
      });
  } catch (error) {
    Error(error);
  }
}

// async function getJobContent(content, selector) {
//   const $ = cheerio.load(content, {
//     decodeEntities: false,
//     normalizeWhitespace: true,
//   });

//   const company = await $(selector.company)
//     .text()
//     .trim();

//   const salary = await $(selector.salary)
//     .text()
//     .trim();

//   const location = await $(selector.location)
//     .text()
//     .trim();

//   const desc = await $(selector.desc)
//     .html()
//     .trim();

//   return {
//     company,
//     salary,
//     location,
//     desc,
//   };
// }

// async function extractTotalJobContent(url, jobId) {
//   try {
//     const content = await fullText.getTextViaMercury(url);

//     const selector = {
//       company: '#companyJobsLink',
//       salary: '.salary.icon div',
//       location: 'div.travelTime-locationText',
//       desc: 'div.job-description',
//     };

//     const result = await getJobContent(content, selector);

//     await updateJob(result, jobId);
//   } catch (error) {
//     Error(error);
//   }
// }


async function getTotalJobContent(url, id) {
  try {
    // const browser = await puppeteer.launch(options);
    const browser = await puppeteer.connect({
      browserWSEndpoint: process.env.CHROME_ADDRESS,
    });
    const page = await browser.newPage();

    await page.goto(url);

    const salary = await page.evaluate(() => document.querySelector('.salary.icon div').innerText);

    const json = await page.$eval('script[type="application/ld+json"]', el => el.text);

    const result = JSON.parse(json);

    await browser.close();

    const location = `${result.jobLocation.address.addressLocality}, ${result.jobLocation.address.postalCode}`;

    const obj = {
      company: result.hiringOrganization.name,
      salary,
      location,
      desc: result.description,
    };

    await updateJob(obj, id);
  } catch (error) {
    Error(error);
  }
  return null;
}

async function totalJobAPI(req, res) {
  const {
    url,
    jobId,
    title,
  } = req.body;

  const dbResult = await createJob(url, title, jobId);

  getTotalJobContent(url, dbResult.id);

  res.status(200)
    .json({
      status: 'success',
      message: `Inserted Job ${dbResult.id}.`,
    });
}

module.exports = {
  totalJobAPI,
  getLastFiftyJobs,
  getTotalJobContent,
};
