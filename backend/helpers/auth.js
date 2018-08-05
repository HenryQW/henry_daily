const passport = require('passport');
const LocalStrategy = require('passport-localapikey').Strategy;
const User = require('../controllers/UserController');

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
      return done(null, false, {
        message: `Invalid apikey : ${apikey}`,
      });
    }
    return done(null, user);
  });
}));

module.exports = passport;
