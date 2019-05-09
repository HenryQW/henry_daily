const express = require('express');

const router = express.Router();
const wechat = require('../controllers/wechatController');

router.get('', wechat.listPost);

module.exports = router;
