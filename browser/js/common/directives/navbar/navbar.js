app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, $log, $state, NavFactory, $mdDialog) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function (scope) {

            scope.user = null;

            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.logout = function () {
                AuthService.logout()
                .then(function () {
                    $state.go($state.current, {}, {reload: true});
                });
            };

            var setUser = function () {
                AuthService.getLoggedInUser().then(function (user) {
                    scope.user = user;
                });
            };

            var removeUser = function () {
                scope.user = null;
            };

            scope.weather = "";

            var toggleAlert = function() {
                AuthService.getLoggedInUser()
                .then(function(user){
                    scope.userId = user.id;
                    NavFactory.getWeather(scope.userId)
                    .then(function(weather){
                        if(weather.wet > 5){
                            scope.weatherAlert = "You might want to skip out on watering your plants over the next few days. Nature is taking care of it! ";
                            if (scope.weather !== []) {
                                scope.weather = "The forecast for today is " + Math.floor(weather.weather[1]) + " degrees and " + weather.weather[0].toLowerCase()+ ".";
                            }
                            scope.showAlert = true;
                        } else if (weather.dry>5) {
                            if (scope.weather !== []) {
                                scope.weatherAlert = "You may want to get outside and water your plants! It is dry out there. ";
                                scope.weather = "The forecast for today is " + Math.floor(weather.weather[1]) + " degrees and " + weather.weather[0].toLowerCase()+ ".";
                            }
                            scope.showAlert = true;
                        }
                    })
                    .catch($log.error);
                })
                .catch($log.error);
            };

            scope.showConfirm = function(ev) {
                var confirm = $mdDialog.confirm()
                    .title('Weather alert')
                    .htmlContent(scope.weatherAlert + scope.weather)
                    .ariaLabel('Alert Dialog for Weather')
                    .targetEvent(ev)
                    .clickOutsideToClose(true)
                    .ok('Thanks!');

                $mdDialog.show(confirm).then(function() {
                    scope.status = 'Confirmed.';
                });
            };

            setUser();
            toggleAlert();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.loginSuccess, toggleAlert);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, toggleAlert);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }
    };
});

