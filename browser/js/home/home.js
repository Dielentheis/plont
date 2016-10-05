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
            $scope.user = {};
            $scope.user.firstName = 'friend';
        } else {
            $scope.user = user;
        }
    })
    .catch($log.error);
});

