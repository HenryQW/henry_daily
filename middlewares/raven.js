const Raven = require('raven');
const git = require('git-rev-sync');

Raven.config(process.env.SENTRY, {
  release: git.short(),
}).install();

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
