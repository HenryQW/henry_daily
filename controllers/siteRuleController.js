const db = require('../models');

const getAllSiteRules = async (req, res) => {
    try {
        const data = await db.SiteRule.findAll();
        res.status(200).json({
            status: 'Success',
            data,
            message: 'Retrieved ALL SiteRules',
        });
    } catch (error) {
        Error(error);
    }
};

const getSingleSiteRuleByHostname = async (hostname) => {
    try {
        return await db.SiteRule.findOne({
            where: {
                hostname,
            },
        });
    } catch (error) {
        Error(error);
    }
};

const getSingleSiteRule = async (req, res) => {
    try {
        const data = await getSingleSiteRuleByHostname(req.params.hostname);
        if (data !== null) {
            res.status(200).json({
                status: 'Success',
                data,
                message: `Retrieved SiteRule ${parseInt(data.id)}: ${
                    data.name
                }`,
            });
        }
        res.status(404).json({
            status: 'Not Found',
            message: `No SiteRule with hostname of ${req.params.hostname} was found`,
        });
    } catch (error) {
        Error(error);
    }
};

const createSiteRule = async (req, res) => {
    try {
        const dbResult = await db.SiteRule.create({
            name: req.body.name,
            hostname: req.body.hostname,
            title: req.body.title,
            content: req.body.content,
            sanitiser: JSON.parse(req.body.sanitiser),
        });

        if (dbResult !== null) {
            res.status(200).json({
                status: 'Success',
                message: `Inserted SiteRule ${dbResult.id}.`,
            });
        } else {
            res.status(404).json({
                status: 'Not Found',
                message: 'No SiteRule with hostname of ',
            });
        }
    } catch (error) {
        Error(error);
    }
};

module.exports = {
    getAllSiteRules,
    getSingleSiteRule,
    getSingleSiteRuleByHostname,
    createSiteRule,
};
