app.config(function ($stateProvider) {

    $stateProvider.state('userPlants', {
        url: '/user-plants',
        controller: 'UserPlantController',
        templateUrl: 'js/users-plants/users-plants.html'
    });

});

app.controller('UserPlantController', function ($scope, $log, AuthService) {
    AuthService.getLoggedInUser()
    .then(function (user) {
        if (!user) {
            $scope.loggedIn = false;
            $scope.user = {};
            $scope.user.firstName = 'friend';
        } else {
            $scope.loggedIn = true;
            $scope.user = user;
            if (!user.firstName) $scope.user.firstName = 'friend';
        }
    })
    .catch($log.error);

});
