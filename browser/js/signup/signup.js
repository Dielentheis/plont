app.config(function($stateProvider) {
    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'js/signup/signup.html',
        controller: 'SignupCtrl'
    });
});

app.controller('SignupCtrl', function(SignupFactory, $log, $scope) {
    $scope.createUser = SignupFactory.createUser;
});

app.factory('SignupFactory', function($state, $log, AuthService) {
    var returnObj = {};

    returnObj.createUser = function(userData) {
        AuthService.signup(userData)
        .then(function() {
            $state.go('user-plots');
        })
        .catch($log.error)
    };
    
    return returnObj;
});
