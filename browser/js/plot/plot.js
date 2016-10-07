app.config(function($stateProvider) {
    $stateProvider.state('plot', {
        url: '/plot/:id',
        templateUrl: 'js/plot/plot.html',
        controller: 'PlotCtrl'
    });
});

app.controller('PlotCtrl', function($scope, PlotFactory) {
	PlotFactory.fetchPlot()
	.then(function(plot) {
		$scope.plot = plot;
	})
});

app.factory('PlotFactory', function($http, $stateParams) {
	var returnObj = {};

	returnObj.fetchPlot = function() {
		return $http.get('/api/plots/' + $stateParams.id)
		.then(function(plot) {
			return plot.data;
		});
	}

	return returnObj;
});
