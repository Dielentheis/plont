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

