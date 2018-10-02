const express = require('express');

const router = express.Router();
const openCC = require('../controllers/openCCController');

router.post('/', openCC.convert);

module.exports = router;
