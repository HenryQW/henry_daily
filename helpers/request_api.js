const rq = require('request-promise');

const request = async (uri, params) => {
    const options = {
        method: 'POST',
        uri,
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

    Object.keys(params).forEach((param) => {
        options.body[param] = params[param];
    });

    return await rq(options);
};

module.exports = {
    request,
};
