const express = require('express');

const router = express.Router();
const SiteRule = require('../controllers/SiteRuleController');
const passport = require('passport');

router.get('', SiteRule.getAllSiteRules);
router.get('/:id', SiteRule.getSingleSiteRule);
router.post('/', passport.authenticate('localapikey'), SiteRule.createSiteRule);
router.put('/:id', passport.authenticate('localapikey'), SiteRule.updateSiteRule);
router.delete('/:id', passport.authenticate('localapikey'), SiteRule.removeSiteRule);


module.exports = router;
