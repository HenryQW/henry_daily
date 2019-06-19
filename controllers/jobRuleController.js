const db = require('../models');

const getAllJobRules = async (req, res) => {
    try {
        const data = await db.JobRule.findAll();
        res.status(200).json({
            status: 'Success',
            data,
            message: 'Retrieved ALL JobRules',
        });
    } catch (error) {
        Error(error);
    }
};

const getSingleJobRuleByHostname = async (hostname) => {
    try {
        return await db.JobRule.findOne({
            where: {
                hostname,
            },
        });
    } catch (error) {
        Error(error);
    }
};

const getSingleJobRule = async (req, res) => {
    try {
        const data = await getSingleJobRuleByHostname(req.params.hostname);
        if (data !== null) {
            res.status(200).json({
                status: 'Success',
                data,
                message: `Retrieved JobRule ${parseInt(data.id)}: ${data.name}`,
            });
        }
        res.status(404).json({
            status: 'Not Found',
            message: `No JobRule with hostname of ${req.params.hostname} was found`,
        });
    } catch (error) {
        Error(error);
    }
};

const createJobRule = async (req, res) => {
    try {
        const dbResult = await db.JobRule.create({
            hostname: req.body.hostname,
            title: req.body.title,
            company: req.body.company,
            salary: req.body.salary,
            location: req.body.location,
            desc: req.body.desc,
        });

        if (dbResult !== null) {
            res.status(200).json({
                status: 'Success',
                message: `Inserted JobRule ${dbResult.id}.`,
            });
        } else {
            res.status(404).json({
                status: 'Not Found',
                message: 'No JobRule with hostname of ',
            });
        }
    } catch (error) {
        Error(error);
    }
};

const removeJobRule = async (req, res) => {
    try {
        const dbResult = await db.JobRule.destroy({
            where: {
                hostname: req.params.hostname,
            },
        });

        if (dbResult !== null) {
            res.status(200).json({
                status: 'Success',
                message: `Removed JobRule ${parseInt(req.params.id)}`,
            });
        }
        res.status(404).json({
            status: 'Not Found',
            message: `No JobRule with hostname of ${req.params.hostname} was found`,
        });
    } catch (error) {
        Error(error);
    }
};

module.exports = {
    getAllJobRules,
    getSingleJobRule,
    getSingleJobRuleByHostname,
    createJobRule,
    removeJobRule,
};
