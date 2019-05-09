const request = require('../helpers/request_api');
const feedGenerator = require('../helpers/feedGenerator');

const listPost = async (req, res) => {
    let result = { message: 'Invalid tid' };
    const meta = {};
    if (req.query.tid && parseInt(req.query.tid)) {
        meta.tid = req.query.tid;
        const uri = process.env.WECHAT_API;
        const params = {
            tid: parseInt(req.query.tid),
            h_ts: Date.now(),
        };

        try {
            let response = await request.request(uri, params);
            if (response && response.data && response.data.list) {
                let data = response.data.list;

                if (response.data.more) {
                    params.last_id = response.data.last_id;
                    response = await request.request(uri, params);

                    if (response && response.data && response.data.list) {
                        data = data.concat(response.data.list);
                    }
                }

                result = data
                    .filter((e) => e.source !== '1')
                    .map((e) => ({
                        guid: e.id,
                        link: e.link_orig,
                        title: `[${e.member.nick}] ${e.title}`,
                        author: e.member.wechat_name || e.member.nick,
                        wechat: e.member.wechat_id || e.member.nick,
                        pubDate: new Date(e.ct * 1000),
                    }));
            }
            res.setHeader('Content-Type', 'application/xml');
            return res.status(200).send(feedGenerator.rss2(meta, result));
        } catch (error) {
            result = { error: true, messages: error.message };
        }
    }
    return res.status(400).json(result);
};

module.exports = {
    listPost,
};
