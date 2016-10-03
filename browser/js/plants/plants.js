app.config(function($stateProvider) {
    $stateProvider.state('plants', {
        url: '/plants',
        templateUrl: 'js/plants/plants.html',
        controller: 'PlantsCtrl'
    });
});

app.factory('PlantsFactory', function($http, $log) {
	var returnObj = {};

	returnObj.fetchAll = function() {
		return $http.get('/api/plants/')
		.then(function(plants) {
			return plants.data;
		})
		.catch($log.error);
	};

	return returnObj;
});

app.controller('PlantsCtrl', function($scope, PlantsFactory, $log) {
	PlantsFactory.fetchAll()
	.then(function(plants) {
		$scope.plants = plants;
	})
	.catch($log.error);

});
