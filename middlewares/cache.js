const Redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(Redis);

const client = Redis.createClient(process.env.REDIS_URL, {
    password: process.env.REDIS_PASSWORD || null,
});

const set = async (key, value, expire) =>
    await client.setAsync(key, value, 'EX', expire);

const get = async (key) => await client.getAsync(key);

module.exports = {
    set,
    get,
};
