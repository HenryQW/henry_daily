const db = require('../models');

async function findByApiKey(apiKey, fn) {
    try {
        const user = await db.User.findOne({
            where: {
                apiKey,
            },
        });
        return fn(null, user);
    } catch (error) {
        return fn(error, null);
    }
}

module.exports = {
    findByApiKey,
};
