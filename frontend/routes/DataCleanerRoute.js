const express = require('express');

const router = express.Router();
const cleaner = require('../../backend/controllers/DataCleanController');


router.get('', cleaner.startDataCleaning);


module.exports = router;
