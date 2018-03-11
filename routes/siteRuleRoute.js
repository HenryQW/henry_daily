const express = require('express');

const router = express.Router();
const SiteRule = require('../controllers/siteRuleController');


router.get('', SiteRule.getAllSiteRules);
router.get('/:id', SiteRule.getSingleSiteRule);
router.post('/', SiteRule.createSiteRule);
// router.put('/:id', SiteRule.updateSiteRule);
router.delete('/:id', SiteRule.removeSiteRule);


module.exports = router;
