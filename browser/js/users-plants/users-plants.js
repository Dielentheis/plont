app.config(function ($stateProvider) {

    $stateProvider.state('userPlants', {
        url: '/user-plants',
        controller: 'UserPlantController',
        templateUrl: 'js/users-plants/users-plants.html'
    });

});

app.controller('UserPlantController', function ($scope, $log, $state,AuthService, PlantFactory) {
    AuthService.getLoggedInUser()
    .then(function (user) {
        if (!user) {
            $scope.loggedIn = false;
        } else {
            $scope.loggedIn = true;
            $scope.user = user;
            if (!user.firstName) $scope.user.firstName = 'friend';
        }
        PlantFactory.fetchUserPlants($scope.user.id)
        .then(function (plants) {
            $scope.userPlants = plants;
        })
        .catch($log.error);
    })
    .catch($log.error);

    $scope.removePlant = function (userId, plantId) {
        PlantFactory.removePlantFromUser(userId, plantId)
        .then(function (status) {
            return PlantFactory.fetchUserPlants(userId);
        })
        .then(function (plants) {
            $scope.userPlants = plants;
        })
        .catch($log.error);
    };

});
