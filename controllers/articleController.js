const db = require('../models');

const fullText = require('./fullTextController');

const getLastTenArticles = async (req, res) => {
    try {
        const data = await db.Article.findAll({
            limit: 10,
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json({
            status: 'success',
            data,
            message: 'Retrieved Last 10 Articles',
        });
    } catch (error) {
        Error(error);
    }
};

const getSingleArticle = async (req, res) => {
    try {
        const data = await db.Article.findByPk(parseInt(req.params.id));
        res.status(200).json({
            status: 'success',
            data,
            message: `Retrieved Article ${parseInt(req.params.id)}`,
        });
    } catch (error) {
        Error(error);
    }
};

const extractArticleContent = async (id, url) => {
    const result = await fullText.dispatch(url);
    try {
        await db.Article.update(
            {
                content: result.content.trim().replace(/\r?\n|\r/g, ' '),
                title: result.title,
            },
            {
                where: {
                    id: parseInt(id),
                },
            }
        );
    } catch (error) {
        Error(error);
    }
};

const createArticle = async (req, res) => {
    try {
        const dbResult = await db.Article.create({
            url: req.body.url,
            comment: req.body.comment,
        });

        extractArticleContent(dbResult.id, req.body.url);

        res.status(200).json({
            status: 'success',
            message: `Inserted Article ${dbResult.id}.`,
        });
    } catch (error) {
        Error(error);
    }
};

module.exports = {
    getLastTenArticles,
    getSingleArticle,
    createArticle,
};
