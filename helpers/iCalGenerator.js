const ical = require('ical-generator');

const generateICal = (res, events, type) => {
    const cal = ical({
        name: `💰${type} Calendar`,
        timezone: 'America/New_York',
        domain: 'https://api.henry.wang',
        prodId: `//henry.wang//${type}-ical-generator//EN`,
        events,
    });

    cal.serve(res);
};

module.exports = {
    generateICal,
};
