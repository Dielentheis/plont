app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});

app.controller('HomeCtrl', function ($scope, AuthService, $log) {
    AuthService.getLoggedInUser()
    .then(function (user) {
        if (!user) {
            $scope.loggedIn = false;
        } else {
            $scope.loggedIn = true;
            $scope.user = user;
        }
    })
    .catch($log.error);
});

