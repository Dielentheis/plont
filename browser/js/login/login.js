app.config(function ($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });
});

app.controller('LoginCtrl', function ($scope, AuthService, $state) {
    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function (loginInfo) {
        $scope.error = null;

        loginInfo.email = loginInfo.email.toLowerCase();  // RESOLVES CASE-SENSITIVE EMAIL ISSUE PT (2/2)

        AuthService.login(loginInfo)
        .then(function () {
            $state.go('home');
        })
        .catch(function () {
            $scope.error = 'Invalid login credentials.';
        });
    };
});