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

    return returnObj;
});

app.controller('PlantCtrl', function(PlantFactory, $scope, $stateParams, $log, AuthService) {
    PlantFactory.fetchOne($stateParams.id)
    .then(function(plant) {
        $scope.plant = plant;
    })
    .catch($log.error);

    AuthService.getLoggedInUser()
    .then(function (user) {
        $scope.user = user;
    })
    .catch($log.error);
});
