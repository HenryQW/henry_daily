const express = require('express');

const router = express.Router();


router.get('/', (req, res) => {
  res.render('index', {
    title: 'Henry\'s API server.',
  });
});


module.exports = router;
