app.config(function($stateProvider) {
    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'js/signup/signup.html',
        controller: 'SignupCtrl'
    });
});

app.controller('SignupCtrl', function(AuthService, $log, $scope, $state) {
    $scope.error = null;

    $scope.createUser = function(user) {
        $scope.error = null;
        AuthService.signup(user)
        .then(function() {
            $state.go('user-plots');
        })
        .catch(function(){
            $scope.error = "User with that email already exists or zip code not found. Please try again.";
        });
    };
});
