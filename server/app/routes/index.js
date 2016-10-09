'use strict';
var router = require('express').Router(); // eslint-disable-line new-cap
module.exports = router;

router.use('/users', require('./users'));
router.use('/plants', require('./plants/plants.js'));
router.use('/weather', require('./weather/index.js'));
router.use('/plots', require('./plots/plots.js'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
