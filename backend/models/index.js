const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const siteRules = require('../../config/siteRules');

const sequelize = new Sequelize(
  process.env.DAILY_DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    operatorsAliases: false,
    logging: process.env.NODE_ENV !== 'production',
  },
);

const basename = path.basename(__filename);

const db = {};

fs
  .readdirSync(__dirname)
  .filter(file =>
    file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize.sync().then(() => {
  try {
    const {
      rules,
    } = siteRules;

    Object.keys(rules).forEach(async (rule) => {
      await db.SiteRule.findOrCreate({
        where: {
          name: rules[rule].name,
        },
        defaults: {
          hostname: rules[rule].hostname,
          title: rules[rule].title,
          content: rules[rule].content,
          sanitiser: rules[rule].sanitiser,
        },
      }).spread((res, created) => {
        if (created) {
          console.log({
            status: 'success',
            message: `Inserted SiteRule ${res.id}: ${rules[rule].name}.`,
          });
        }
      });
    });
  } catch (error) {
    Error(error);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
