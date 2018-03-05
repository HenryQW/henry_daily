const axios = require('axios');

function triggerHuginn(title) {
  axios.post(process.env.HUGINN_RSS, {
    title,
  });
}

module.exports = {
  triggerHuginn,
};
