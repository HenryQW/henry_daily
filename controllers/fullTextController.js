const axios = require('axios');
const phantom = require('phantom');
const cheerio = require('cheerio');
const urlUtil = require('url');
const siteRule = require('./siteRuleController');

async function startCheerioProcess(content, selector) {
    const $ = cheerio.load(content, {
        decodeEntities: false,
        normalizeWhitespace: true,
    });

    const title = await $(selector.title)
        .html()
        .trim();

    selector.sanitiser.forEach(async (s) => {
        await $(s).remove();
    });

    const final = await $(selector.content)
        .html()
        .trim();

    return {
        title,
        content: final,
    };
}

async function getTextViaPhantomJS(url) {
    try {
        const instance = await phantom.create();
        const page = await instance.createPage();

        await page.open(url);
        const content = await page.property('content');

        page.close();
        instance.exit();

        return content;
    } catch (error) {
        Error(error);
    }
    return null;
}

async function getTextViaMercury(url) {
    try {
        const res = await axios.get(`service.mercury:3000/parser?url=${url}`);
        return res.data;
    } catch (error) {
        Error(error);
    }
    return null;
}

async function dispatch(url) {
    const { hostname } = urlUtil.parse(url);

    const selector = await siteRule.getSingleSiteRuleByHostname(hostname);

    if (selector === null) {
        return getTextViaMercury(url);
    }
    const content = await getTextViaPhantomJS(url);
    return startCheerioProcess(content, selector);
}

module.exports = {
    getTextViaMercury,
    getTextViaPhantomJS,
    startCheerioProcess,
    dispatch,
};
