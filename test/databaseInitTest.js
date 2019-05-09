require('dotenv').config();
const { expect } = require('chai');
const db = require('../models');
const siteRules = require('../helpers/siteRules');

before(async () => {
    await db.sequelize.drop();
    await db.sequelize.sync();
    await db.User.create({ apiKey: process.env.KEY });
});

describe('database init', () => {
    it('SiteRules should have all pre-defined rules', async () => {
        const siteRule = await db.SiteRule.findAll();
        expect(siteRule.length).to.equal(siteRules.rules.length);
    });

    it('Users should have api key', async () => {
        const user = await db.User.findByPk(1);
        expect(user.apiKey).to.equal(process.env.KEY);
    });
});
