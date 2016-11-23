app.config(function($stateProvider) {
    $stateProvider.state('plant', {
        url: '/plant/:id',
        templateUrl: 'js/plant/plant.html',
        controller: 'PlantCtrl'
    });
});

app.factory('PlantFactory', function($http, $log) {
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
        .then(function(data) {
            return data.status;
        })
        .catch($log.error);
    };

    returnObj.fetchUserPlants = function(userId) {
        return $http.get('api/plants/user/' + userId)
        .then(function(plants) {
            return plants.data;
        })
        .catch($log.error);
    };

    returnObj.removePlantFromUser = function(userId, plantId) {
        return $http.delete('api/plants/user/' + userId + '/plant/' + plantId)
        .then(function (data) {
            return data.status;
        })
        .catch($log.error);
    };

    return returnObj;
});

app.controller('PlantCtrl', function(PlantFactory, $scope, AuthService, $stateParams, $log, $state) {
    AuthService.getLoggedInUser()
    .then(function (user) {
        $scope.user = user;
    })
    .catch($log.error);

    PlantFactory.fetchOne($stateParams.id)
    .then(function(plant) {
        $scope.plant = plant;
    })
    .catch($log.error);

    $scope.addPlant = function (plantId) {
        const plantArr = [];
        plantArr.push(plantId);
        PlantFactory.addToUser($scope.user.id, plantArr)
        .then(function(status) {
            if (status === 200) {
                $state.go('userPlants');
            }
        })
        .catch($log.error);
    };
});
