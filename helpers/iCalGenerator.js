const ical = require('ical-generator');

const generateICal = async (req, res, events, type) => {
    const cal = ical({
        name: `💰${type} Calendar`,
        timezone: 'America/New_York',
        domain: 'https://api.henry.wang',
        prodId: `//henry.wang//${type}-ical-generator//EN`,
        events,
    });

    res.status = 200;
    res.respond = false;
    cal.serve(res);
};

module.exports = {
    generateICal,
};
