const axios = require('axios');

const triggerHuginn = (title) => {
    axios.post(process.env.HUGINN_RSS, {
        title,
    });
};

module.exports = {
    triggerHuginn,
};
