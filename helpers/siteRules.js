const rules = [
    {
        name: '知乎日报',
        hostname: 'daily.zhihu.com',
        title: 'h1[class=headline-title]',
        content: 'div[class=content-inner]>div:nth-child(1)',
        sanitiser: [],
    },
    {
        name: '36氪',
        hostname: '36kr.com',
        title: 'h1',
        content: 'section[class=textblock]',
        sanitiser: [],
    },
    {
        name: '好奇心日报',
        hostname: 'www.qdaily.com',
        title: 'h2[class=title]',
        content: 'div[class=detail]',
        sanitiser: [],
    },
    {
        name: '钛媒体',
        hostname: 'www.tmtpost.com',
        title: 'h1',
        content: 'div[class=inner]',
        sanitiser: ['p[style="text-align: center;"]'],
    },
    {
        name: '动点科技',
        hostname: 'cn.technode.com',
        title: 'h1',
        content: 'article',
        sanitiser: ['header', 'footer'],
    },
    {
        name: '少数派',
        hostname: 'sspai.com',
        title: 'h1',
        content: 'div[class=article-content]',
        sanitiser: ['h1'],
    },
    {
        name: '公众号收录网',
        hostname: 'www.gzhshoulu.wang',
        title: 'h2[id=activity-name]',
        content: 'div[id=js_content]',
        sanitiser: [],
    },
    {
        name: '微信公众号',
        hostname: 'mp.weixin.qq.com',
        title: 'h2[id=activity-name]',
        content: 'div[id=js_content]',
        sanitiser: [],
    },
    {
        name: 'BBC',
        hostname: 'www.bbc.com',
        title: 'h1[class=story-body__h1]',
        content: 'div[property=articleBody]',
        sanitiser: ['div[class=bbccom_advert]'],
    },
    {
        name: 'BBC UK',
        hostname: 'www.bbc.co.uk',
        title: 'h1[class=story-body__h1]',
        content: 'div[property=articleBody]',
        sanitiser: ['div[class=bbccom_advert]'],
    },
];

module.exports = {
    rules,
};
