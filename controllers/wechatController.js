const request = require('../helpers/request_api');
const feedGenerator = require('../helpers/feedGenerator');
const cache = require('../middlewares/cache');

const listPost = async (req, res) => {
    let result = { message: 'Invalid tid' };
    const meta = {};
    if (req.query.tid && parseInt(req.query.tid)) {
        meta.tid = req.query.tid;
        const uri = process.env.WECHAT_API_LIST;
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

                result = await Promise.all(
                    data.map(async (e) => {
                        const process = {
                            guid: e.id,
                            link: e.link_orig,
                            title: `[${e.member.nick}] ${e.title}`,
                            description: await getPost(e.id),
                            author: e.member.wechat_name || e.member.nick,
                            wechat: e.member.wechat_id || e.member.nick,
                            pubDate: new Date(e.ct * 1000),
                        };
                        return Promise.resolve(process);
                    })
                );
            }
            res.setHeader('Content-Type', 'application/xml');
            return res.status(200).send(feedGenerator.rss2(meta, result));
        } catch (error) {
            result = { error: true, messages: error.message };
        }
    }
    return res.status(400).json(result);
};

const getPost = async (id) => {
    const uri = process.env.WECHAT_API_POST;
    const params = {
        id,
        h_ts: Date.now(),
    };

    const key = `wechat_post_${id}`;

    let description = '';
    const cached = await cache.get(key);
    if (cached) {
        description = cached;
    } else {
        const response = await request.request(uri, params);

        if (response.data.rich_content) {
            response.data.rich_content.forEach((e) => {
                if (e.new_line) {
                    description += '</div><br>';
                }

                if (e.img) {
                    description += `<img src="${e.img}">`;
                }

                if (e.video) {
                    description += `<iframe frameborder="0" src="${
                        e.video
                    }" allowFullScreen="true"></iframe>`;
                }

                if (e.text) {
                    let text = e.text;

                    if (description.endsWith('<br>')) {
                        description += '<div>';
                    }

                    if (e.bold) {
                        text = `<b>${text}</b>`;
                    }

                    if (e.align) {
                        text = `<span style="text-align: center;display: block;"> ${text}
                        </span>`;
                    }

                    if (e.color) {
                        text = `<span style="color:${e.color}"> ${text}
                        </span>`;
                    }

                    description += text;
                }
            });
        } else {
            description = `<a href='${response.data.link_orig}'>${
                response.data.summary
            }</a>`;
        }

        await cache.set(key, description, 60 * 60 * 24);
    }
    return description;
};

module.exports = {
    listPost,
};
