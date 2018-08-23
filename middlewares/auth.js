const passport = require('passport');
const LocalStrategy = require('passport-localapikey').Strategy;
const Raven = require('raven');
const User = require('../controllers/userController');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByApiKey(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new LocalStrategy((apikey, done) => {
  User.findByApiKey(apikey, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      Raven.captureException(Error(`Unauthorized API key: ${apikey}`), () => done(null, false));
    }
    return done(null, user);
  });
}));


module.exports = passport;
