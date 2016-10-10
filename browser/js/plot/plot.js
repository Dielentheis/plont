app.config(function($stateProvider) {
    $stateProvider.state('plot', {
        url: '/plot/:id',
        templateUrl: 'js/plot/plot.html',
        controller: 'PlotCtrl'
    });
});

app.controller('PlotCtrl', function($scope, PlotFactory, $log) {
	$scope.data = [];
	PlotFactory.fetchPlot()
	.then(function(plot) {
		//var colors = PlotFactory.assignColors(plot.id);
		var colors = {1: '#7166CC', 2: '#3B2F99', 3: '#4392FF', 4: '#CC9A78', 5: '#666666'};
		$scope.plot = plot.layout;
		$scope.data = makeData();
		console.log("data", $scope.data);
		$scope.colorFill = function(value, row, col) {
			if (!value) {
				return 'background-color: #DDDDDD';
			}
			value = value + '';
			console.log("in colorFill", value);
			return 'background-color:' + colors[value];
		};

		console.log("colorfill", $scope.colorFill);

		function makeData() {
			var data = [];
			for (var i = 0; i < plot.layout.length; i++) {
				var row = [];
				for (var j = 0; j < plot.layout[0].length; j++) {
					row.push(plot.layout[i][j].plantId);
				}
				data.push(row);
			}
			return data;
		}

	})
	.catch($log.error);
});

app.factory('PlotFactory', function($http, $stateParams, $log) {
	var returnObj = {};

	returnObj.fetchPlot = function() {
		return $http.get('/api/plots/' + $stateParams.id)
		.then(function(plot) {
			return plot.data;
		})
		.catch($log.error);
	}

	// returnObj.assignColors = function(id) {

	// }

	returnObj.buildPlotTable = function(plotArr) {
		console.log("sup")
	}

	return returnObj;
});
