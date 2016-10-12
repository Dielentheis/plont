'use strict';
// assume all routes start with /api/users
var router = require('express').Router(); // eslint-disable-line new-cap
module.exports = router;
var _ = require('lodash');
var db = require('../../../db/_db.js');
var User = db.model('user');

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

// get user by id
router.get('/:id', function(req, res, next) {
    User.findById(req.params.id)
    .then(function(user) {
        res.send(user);
    })
    .catch(next);
});

// get all plots associated to a certain user
router.get('/:id/plots', function(req, res, next) {
    User.findById(req.params.id)
    .then(function(user) {
        return user.getPlots();
    })
    .then(function(plots) {
        res.send(plots);
    })
    .catch(next);
});

