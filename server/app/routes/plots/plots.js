'use strict';
// assume all routes begin with /api/plots
var router = require('express').Router();
var _ = require('lodash');
var db = require('../../../db/_db.js');
var Plot = db.model('plot');
var PlotPlants = db.model('PlotPlants');

// get all plots
router.get('/', function(req, res, next) {
	Plot.findAll()
	.then(function(plots) {
		res.send(plots);
	})
	.catch(next);
});

// get plot by id
router.get('/:id', function(req, res, next) {
	Plot.findById(req.params.id)
	.then(function(plot) {
		res.send(plot);
	})
	.catch(next);
});

// creates a plot associated with a specific user (aliased as Gardener) -- pass in 
// userId as part of req.body!!
router.post('/', function(req, res, next) {
	Plot.create(req.body)
	.then(function(plot) {
		plot.setUser(req.body.userId);
		res.send(plot);
	})
	.catch(next);
});

// updating plot by adding a plant
router.put('/:plotId/plants/:plantId', function(req, res, next) {
	Plot.findById(req.params.plotId)
	.then(function(plot) {
		return plot.addPlant(req.params.plantId);
	})
	.then(function() {
		res.sendStatus(201)
	})
	.catch(next);
});

// deletes association between plot and plant (removes a specific plant
// from a specific plot)
router.delete('/:plotId/plants/:plantId', function(req, res, next) {
	PlotPlants.destroy({
		where: {
			plotId: req.params.plotId,
			plantId: req.params.plantId
		}
	})
	.then(function() {
		res.sendStatus(200)
	})
	.catch(next);
});

module.exports = router;
