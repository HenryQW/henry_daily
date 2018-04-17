require('dotenv').config();
const { expect } = require('chai');
const db = require('../models');
const siteRules = require('../config/siteRules');

describe('Database init()', () => {
  before((done) => {
    db.sequelize
      .sync()
      .then(async () => {
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('SiteRules should have all pre-defined rules', async () => {
    const siteRule = await db.SiteRule.findAll();
    expect(siteRule.length).to.equal(siteRules.rules.length);
  });

  it('Users should have Henry', async () => {
    const user = await db.User.findById(1);
    expect(user.apiKey).to.equal(process.env.KEY);
  });
});
