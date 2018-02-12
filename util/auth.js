const passport = require('passport');
const LocalStrategy = require('passport-localapikey').Strategy;

const users = [{
  id: 1,
  username: 'bob',
  password: 'secret',
  email: 'bob@example.com',
  apikey: process.env.KEY,
}];

function findById(id, fn) {
  const idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error(`User ${id} does not exist`));
  }
}

function findByUsername(username, fn) {
  for (let i = 0, len = users.length; i < len; i++) {
    const user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}


function findByApiKey(apikey, fn) {
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if (user.apikey === apikey) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new LocalStrategy(((apikey, done) => {
  process.nextTick(() => {
    findByApiKey(apikey, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: `Unknown apikey : ${apikey}`,
        });
      }
      return done(null, user);
    });
  });
})));
module.exports = passport;
