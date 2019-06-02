const express = require('express');

const router = express.Router();
const stock = require('../controllers/stockController');

router.get('/dividend', stock.getDividendICal);
router.post('/', stock.createStock);
router.put('/:symbol/:share', stock.updateStock);

module.exports = router;
