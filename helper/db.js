const promise = require('bluebird');
require('dotenv').config();


const options = {
  promiseLib: promise,
};


const pgp = require('pg-promise')(options);


const db = pgp({
  host: process.env.DB_HOST,
  port: process.env.DB_POST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});


module.exports = db;