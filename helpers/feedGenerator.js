const Feed = require('feed').Feed;

const rss2 = (meta, data) => generateFeed(meta, data).rss2();

const generateFeed = (meta, data) => {
    const feed = new Feed({
        title: '微信公众号',
        image: 'https://res.wx.qq.com/a/wx_fed/assets/res/OTE0YTAw.png',
        id: meta.tid,
        link: `https://mp.weixin.qq.com/`,
        updated: new Date(),
        generator: 'WeChat to RSS by HenryQW (henry.wang)',
        author: {
            name: 'HenryQW',
            email: 'wechat@henry.wang',
            link: 'henry.wang',
        },
    });

    data.forEach((post) => {
        feed.addItem({
            title: post.title,
            guid: post.guid,
            link: post.link,
            description: post.description,
            author: [{ name: post.wechat, email: post.author }],
            date: post.pubDate,
        });
    });

    return feed;
};

module.exports = {
    rss2,
};
