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
		$scope.plantInfoArr = PlotFactory.makeKey(plot.layout, plants);

	})
	.catch($log.error);
});

app.factory('PlotFactory', function($http, $stateParams, $log) {
	var returnObj = {};
	var idNames = {}; // key id, value plant name
	var idNums = {}; // key id, value number of plant to plant

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

	function calcNumsToPlant(plot, plants) {
		for (var i = 0; i < plot.length; i++) {
			for (var j = 0; j < plot[0].length; j++) {
				if (!idNums[plot[i][j].plantId]) {
					idNums[plot[i][j].plantId] = 1;
				}
				else {
					idNums[plot[i][j].plantId]++;
				}
			}
		}
		divideAreaByPlants(plants);
	}

	function divideAreaByPlants(plants) {
		plants.forEach(function(plant) {
			if (idNums[plant.id]) {
				var plantArea = plant.height * plant.width;
				idNums[plant.id] = Math.floor(idNums[plant.id] / plantArea);
			}
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
		calcNumsToPlant(plot, plants);
		var arr = [];
		for (var i = 0; i < plot.length; i++) {
			for (var j = 0; j < plot[0].length; j++) {
				if (plot[i][j].plantId) {
					if (!isExisting(arr, idNames[plot[i][j].plantId])) {
						arr.push({class: plot[i][j].class, name: idNames[plot[i][j].plantId], numToPlant: idNums[plot[i][j].plantId]})
					}
				}
			}
		}
		return arr;
	};

	function isExisting(arr, name) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].name === name) {
				return true;
			}
		}
		return false;
	}

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
