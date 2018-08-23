const Raven = require('raven');
const git = require('git-rev-sync');

Raven.config('https://630689efc9aa403f86819d6520a03fb0@sentry.io/1267129', {
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
