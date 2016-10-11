app.config(function($stateProvider) {
    $stateProvider.state('plant', {
        url: '/plant/:id',
        templateUrl: 'js/plant/plant.html',
        controller: 'PlantCtrl'
    });
});


app.factory('PlantFactory', function($http, $log, $state) {
	var returnObj = {};

    returnObj.fetchOne = function(id) {
        return $http.get('/api/plants/' + id)
        .then(function(plant) {
            return plant.data;
        })
        .catch($log.error);
    };

    returnObj.addToUser = function (userId, plants) {
        return $http.put('api/plants/' + userId, plants)
        .then(function(plant) {
            $state.go('userPlants')
        })
        .catch($log.error);
    }

    returnObj.fetchUserPlants = function(userId) {
        return $http.get('api/plants' + userId)
        .then(function(plants) {
            return plants.data
        })
        .catch($log.error);
    }

	return returnObj;
});

app.controller('PlantCtrl', function(PlantFactory, $scope, AuthServices, $stateParams, $log) {

    AuthService.getLoggedInUser()
    .then(function (user) {
        $scope.user = user
    })
    .catch($log.error);

	PlantFactory.fetchOne($stateParams.id)
	.then(function(plant) {
		$scope.plant = plant;
	})
	.catch($log.error);

    $scope.addPlant = PlantFactory.addToUser();

    return returnObj;
});
