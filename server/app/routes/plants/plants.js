'use strict';
// assume all routes begin with /api/plants
var router = require('express').Router();
var _ = require('lodash');
var db = require('../../../db/_db.js');
var Plant = db.model('plant');

router.get('/', function(req, res, next) {
	Plant.findAll()
	.then(function(plants) {
		res.send(plants);
	})
	.catch(next);
});

router.get('/sunPlants', function(req, res, next) {
	Plant.getSunPlants()
	.then(function(plants) {
		res.send(plants);
	})
	.catch(next);
});

router.get('/partShadePlants', function(req, res, next) {
	Plant.getPartShadePlants()
	.then(function(plants) {
		res.send(plants);
	})
	.catch(next);
})

router.get('/shadePlants', function(req, res, next) {
	Plant.getShadePlants()
	.then(function(plants) {
		res.send(plants)
	})
	.catch(next);
});

router.get('/:id', function(req, res, next) {
	Plant.findById(req.params.id)
	.then(function(plant) {
		res.send(plant);
	})
	.catch(next);
});

module.exports = router;
