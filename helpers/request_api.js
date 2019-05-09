const rq = require('request-promise');

const options = {
    method: 'POST',
    headers: {
        'User-Agent': process.env.WECHAT_UA,
        'Content-Type': 'application/json',
    },
    body: {
        h_model: process.env.WECHAT_HEADER_MODEL,
        h_ch: process.env.WECHAT_HEADER_CH,
    },
    json: true,
};

const request = async (uri, params) => {
    options.uri = uri;

    Object.keys(params).forEach((param) => {
        options.body[param] = params[param];
    });

    return await rq(options);
};

module.exports = {
    request,
};
