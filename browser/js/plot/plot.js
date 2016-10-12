app.config(function($stateProvider) {
    $stateProvider.state('plot', {
        url: '/plot/:id',
        templateUrl: 'js/plot/plot.html',
        controller: 'PlotCtrl'
    });
});

app.controller('PlotCtrl', function($scope, PlotFactory, $log) {
	PlotFactory.fetchPlot()
	.then(function(plot) {

		$scope.plotName = plot.name;
		$scope.plot = plot.layout;
		$scope.data = PlotFactory.buildPlotTable(plot.layout);
		$scope.keyObj = PlotFactory.makeKey(plot.layout);
		console.log("keyarr", $scope.keyObj);
	})
	.catch($log.error);
});

app.factory('PlotFactory', function($http, $stateParams, $log, CreatePlotFactory) {
	var returnObj = {};
	var idNames = {};

	function idsToNames() {
		CreatePlotFactory.usersPlants.forEach(function(plant) {
			idNames[plant.id] = plant.name;
		});
	}

	returnObj.fetchPlot = function() {
		return $http.get('/api/plots/' + $stateParams.id)
		.then(function(plot) {
			return plot.data;
		})
		.catch($log.error);
	}

	returnObj.makeKey = function(plot) {
		idsToNames();
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
	}

	returnObj.buildPlotTable = function(plot) {
		console.log("buily plot table", plot);
		var data = [];
		for (var i = 0; i < plot.length; i++) {
			var row = [];
			for (var j = 0; j < plot[0].length; j++) {
				row.push(plot[i][j].plantId);
			}
			data.push(row);
		}
		return data;
	}

	return returnObj;
});
