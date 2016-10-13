app.config(function($stateProvider) {
    $stateProvider.state('plot', {
        url: '/plot/:id',
        templateUrl: 'js/plot/plot.html',
        controller: 'PlotCtrl'
    });
});

app.controller('PlotCtrl', function($scope, PlotFactory, $log) {
	var plot = [];
	PlotFactory.fetchPlot()
	.then(function(plotty) {
		plot = plotty;
		return PlotFactory.getPlotPlants(plot)
	})
	.then(function(plants) {
		$scope.plotName = plot.name;
		$scope.plot = plot.layout;
		$scope.data = PlotFactory.buildPlotTable(plot.layout);
		$scope.keyObj = PlotFactory.makeKey(plot.layout, plants);

	})
	.catch($log.error);
});

app.factory('PlotFactory', function($http, $stateParams, $log) {
	var returnObj = {};
	var idNames = {};

	returnObj.getPlotPlants = function(plot) {
		return $http.get('/api/plots/' + plot.id + '/plants')
		.then(function(plants) {
			return plants.data;
		})
		.catch($log.error);
	}

	function idsToNames(plants) {
		plants.forEach(function(plant) {
			idNames[plant.id] = plant.name;
		});
	}

	returnObj.fetchPlot = function() {
		return $http.get('/api/plots/' + $stateParams.id)
		.then(function(plot) {
			return plot.data;
		})
		.catch($log.error);
	};

	returnObj.makeKey = function(plot, plants) {
		idsToNames(plants);
		var keys = {};
		for (var i = 0; i < plot.length; i++) {
			for (var j = 0; j < plot[0].length; j++) {
				if (plot[i][j].plantId) {
					if (!keys[plot[i][j].plantId]) {
						keys[idNames[plot[i][j].plantId]] = plot[i][j].class;
					}
				}
			}
		}
		return keys;
	};

	returnObj.buildPlotTable = function(plot) {
		var data = [];
		for (var i = 0; i < plot.length; i++) {
			var row = [];
			for (var j = 0; j < plot[0].length; j++) {
				row.push(plot[i][j].plantId);
			}
			data.push(row);
		}
		return data;
	};

	return returnObj;
})
