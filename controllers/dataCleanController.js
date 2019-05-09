const urlUtil = require('url');
const siteRule = require('./siteRuleController');
const fullText = require('./fullTextController');

async function startDataCleaning(req, res) {
    const { hostname } = urlUtil.parse(req.query.url);

    const selector = await siteRule.getSingleSiteRuleByHostname(hostname);

    if (selector) {
        const content = await fullText.getTextViaPhantomJS(req.query.url);
        const result = await fullText.startCheerioProcess(content, selector);
        res.status(200).json({
            status: 'completed',
            data: result,
            message: 'Data cleaning has completed.',
        });
    } else {
        res.status(200).json({
            status: 'failed',
            message: `There is no data cleaner for ${hostname}`,
        });
    }
}

module.exports = {
    startDataCleaning,
};
