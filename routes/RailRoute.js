const express = require('express');

const router = express.Router();
const rail = require('../controllers/railController');

router.get('/arr/:origin/:destination', rail.getArrivals);

router.get('/time/:origin/:destination', rail.getTimeTable);

module.exports = router;
