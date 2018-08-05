const axios = require('axios');
const Pool = require('pg-pool');
const {
  Client,
} = require('pg');
const db = require('../models');

const options = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.HUGINN_DB_NAME,
  password: process.env.DB_PASS,
  max: 10,
  min: 3,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
};

async function getRSSStat(req, res) {
  try {
    options.database = process.env.RSS_DB_NAME;
    const client = new Client(options);
    client.connect();

    const {
      rows,
    } = await client.query(`
        SELECT count(t.*)
        FROM ttrss_entries t
        WHERE t.date_entered >  current_date - interval '7 days'
        GROUP BY date_trunc('day', t.date_entered)
        ORDER BY date_trunc('day', t.date_entered);
    `);
    client.end();
    res.status(200).json(rows);
  } catch (error) {
    Error(error);
  }
}

async function getHuginnStat(req, res) {
  try {
    options.database = process.env.HUGINN_DB_NAME;
    const client = new Client(options);
    client.connect();

    const {
      rows,
    } = await client.query(`
        SELECT count(t.*)
        FROM events t
        WHERE t.created_at >  current_date - interval '7 days'
        GROUP BY date_trunc('day', t.created_at)
        ORDER BY date_trunc('day', t.created_at);
    `);
    client.end();
    res.status(200).json(rows);
  } catch (error) {
    Error(error);
  }
}

async function getDockerHubStat(req, res) {
  try {
    options.database = process.env.DAILY_DB_NAME;
    const client = new Client(options);
    client.connect();

    const {
      rows,
    } = await client.query(`
        SELECT pull as count
        FROM "DockerHubs"
        WHERE "createdAt" >  current_date - interval '7 days'
        ORDER BY date_trunc('day', "createdAt");
    `);
    client.end();
    res.status(200).json(rows);
  } catch (error) {
    Error(error);
  }
}


async function retrieveDockerHubStat(url) {
  try {
    const result = await axios.get(url);

    const dbResult = await db.DockerHub.create({
      repo: `${result.data.namespace}/${result.data.name}`,
      pull: result.data.pull_count,
      star: result.data.star_count,
    });
    return dbResult.id != null;
  } catch (error) {
    Error(error);
    return false;
  }
}


module.exports = {
  getRSSStat,
  getHuginnStat,
  getDockerHubStat,
  retrieveDockerHubStat,
};
