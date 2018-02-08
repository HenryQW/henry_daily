var promise = require('bluebird');
require('dotenv').config();

var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
const con = {
  host: process.env.DB_HOST,
  port: process.env.DB_POST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
};

const db = pgp(con);

module.exports = db;