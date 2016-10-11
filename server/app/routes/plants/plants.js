'use strict';
// assume all routes begin with /api/plants
var router = require('express').Router(); // eslint-disable-line
var db = require('../../../db/_db.js');
var Plant = db.model('plant'); // eslint-disable-line
var User = db.model('user');

// get all plants
router.get('/', function(req, res, next) {
	Plant.findAll()
	.then(function(plants) {
		res.send(plants);
	})
	.catch(next);
});

// get all plants that require full sun
router.get('/sunPlants', function(req, res, next) {
	Plant.getSunPlants()
	.then(function(plants) {
		res.send(plants);
	})
	.catch(next);
});

// get all plants that require part sun/part shade
router.get('/partShadePlants', function(req, res, next) {
	Plant.getPartShadePlants()
	.then(function(plants) {
		res.send(plants);
	})
	.catch(next);
});

// get all plants that require all shade
router.get('/shadePlants', function(req, res, next) {
	Plant.getShadePlants()
	.then(function(plants) {
		res.send(plants)
	})
	.catch(next);
});

// get plant by id
router.get('/:id', function(req, res, next) {
	Plant.findById(req.params.id)
	.then(function(plant) {
		res.send(plant);
	})
	.catch(next);
});

// add plant(s) to user
router.put('/:userId', function(req, res, next) {
// get an array of plant objects, promise.all for association?
	User.findById(req.params.userId)
	.then(function(user) {
		console.log("adding Plants:", req.body);
		user.addPlants(req.body);
	})
	.then(function(data) {
		console.log("what is this data", data);
	})
	.catch(next);
})

// get users plant(s)
router.get('/:userId', function(req, res, next) {
// grab all plants associated with user
})

module.exports = router;
