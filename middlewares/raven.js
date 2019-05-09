const Raven = require('raven');

Raven.config(process.env.SENTRY).install();

module.exports = async (req, res, next) => {
    try {
        await next();
    } catch (err) {
        res.status = 404;
        Raven.captureException(err, () => {
            res.render('error', {
                message: err.message,
                error: err,
            });
        });
    }
};
