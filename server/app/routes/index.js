'use strict';
var router = require('express').Router(); // eslint-disable-line new-cap
module.exports = router;

router.use('/users', require('./users'));
router.use('/plants', require('./plants'));
router.use('/weather', require('./weather'));
router.use('/plots', require('./plots'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
