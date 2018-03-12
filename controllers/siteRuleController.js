const db = require('../models');


async function getAllSiteRules(req, res) {
  try {
    const data = await db.SiteRule.findAll();
    res.status(200)
      .json({
        status: 'success',
        data,
        message: 'Retrieved ALL SiteRules',
      });
  } catch (error) {
    Error(error);
  }
}

async function getSingleSiteRuleByHostname(hostname) {
  try {
    return db.SiteRule.findOne({
      where: {
        hostname,
      },
    });
  } catch (error) {
    Error(error);
  }
}

async function getSingleSiteRule(req, res) {
  try {
    const data = await getSingleSiteRuleByHostname(req.params.hostname);
    res.status(200)
      .json({
        status: 'success',
        data,
        message: `Retrieved SiteRule ${parseInt(data.id)}: ${data.name}`,
      });
  } catch (error) {
    Error(error);
  }
}


async function createSiteRule(req, res) {
  try {
    const dbResult = await db.SiteRule.create({
      name: req.body.name,
      hostname: req.body.hostname,
      title: req.body.title,
      content: req.body.content,
      sanitiser: req.body.sanitiser,
    });

    res.status(200)
      .json({
        status: 'success',
        message: `Inserted SiteRule ${dbResult.id}.`,
      });
  } catch (error) {
    Error(error);
  }
}


// async function updateSiteRule(req, res) {
//   try {
//     await db.SiteRule.update({
//       name: req.body.name,
//       hostname: req.body.hostname,
//       title: req.body.title,
//       content: req.body.content,
//       sanitiser: req.body.sanitiser,
//     }, {
//       where: {
//         id: parseInt(req.body.id),
//       },
//     });

//     res.status(200)
//       .json({
//         status: 'success',
//         message: `Updated SiteRule ${req.body.id}`,
//       });
//   } catch (error) {
//     Error(error);
//   }
// }


async function removeSiteRule(req, res) {
  try {
    await db.SiteRule.destroy({
      where: {
        id: parseInt(req.params.id),
      },
    });

    res.status(200)
      .json({
        status: 'success',
        message: `Removed SiteRule ${parseInt(req.params.id)}`,
      });
  } catch (error) {
    Error(error);
  }
}


module.exports = {
  getAllSiteRules,
  getSingleSiteRule,
  getSingleSiteRuleByHostname,
  createSiteRule,
  // updateSiteRule,
  removeSiteRule,
};
