'use strict';

window.app = angular.module('FullstackGeneratedApp', ['fsaPreBuilt', 'ui.router', 'ngAnimate', 'ngAria', 'ngMaterial', 'angular.filter']);

app.config(function ($urlRouterProvider, $locationProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
    // Trigger page refresh when accessing an OAuth route
    $urlRouterProvider.when('/auth/:provider', function () {
        window.location.reload();
    });
});

// This app.run is for controlling access to specific states.
app.run(function ($rootScope, AuthService, $state) {

    // The given state requires an authenticated user.
    var destinationStateRequiresAuth = function destinationStateRequiresAuth(state) {
        return state.data && state.data.authenticate;
    };

    // $stateChangeStart is an event fired
    // whenever the process of changing a state begins.
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

        if (!destinationStateRequiresAuth(toState)) {
            // The destination state does not require authentication
            // Short circuit with return.
            return;
        }

        if (AuthService.isAuthenticated()) {
            // The user is authenticated.
            // Short circuit with return.
            return;
        }

        // Cancel navigating to new state.
        event.preventDefault();

        AuthService.getLoggedInUser().then(function (user) {
            // If a user is retrieved, then renavigate to the destination
            // (the second time, AuthService.isAuthenticated() will work)
            // otherwise, if no user is logged in, go to "login" state.
            if (user) {
                $state.go(toState.name, toParams);
            } else {
                $state.go('login');
            }
        });
    });
});

/* eslint-disable */
$(document).ready(function () {
    $(".button-collapse").sideNav();
});

app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('about', {
        url: '/about',
        controller: 'AboutController',
        templateUrl: 'js/about/about.html'
    });
});

app.controller('AboutController', function ($scope, FullstackPics) {

    // Images of beautiful Fullstack people.
    $scope.images = _.shuffle(FullstackPics);
});

(function () {

    'use strict';

    // Hope you didn't forget Angular! Duh-doy.

    if (!window.angular) throw new Error('I can\'t find Angular!');

    var app = angular.module('fsaPreBuilt', []);

    app.factory('Socket', function () {
        if (!window.io) throw new Error('socket.io not found!');
        return window.io(window.location.origin);
    });

    // AUTH_EVENTS is used throughout our app to
    // broadcast and listen from and to the $rootScope
    // for important events about authentication flow.
    app.constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });

    app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        var statusDict = {
            401: AUTH_EVENTS.notAuthenticated,
            403: AUTH_EVENTS.notAuthorized,
            419: AUTH_EVENTS.sessionTimeout,
            440: AUTH_EVENTS.sessionTimeout
        };
        return {
            responseError: function responseError(response) {
                $rootScope.$broadcast(statusDict[response.status], response);
                return $q.reject(response);
            }
        };
    });

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push(['$injector', function ($injector) {
            return $injector.get('AuthInterceptor');
        }]);
    });

    app.service('AuthService', function ($http, Session, $rootScope, AUTH_EVENTS, $q) {

        function onSuccessfulLogin(response) {
            var user = response.data.user;
            Session.create(user);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            return user;
        }

        // Uses the session factory to see if an
        // authenticated user is currently registered.
        this.isAuthenticated = function () {
            return !!Session.user;
        };

        this.getLoggedInUser = function (fromServer) {

            // If an authenticated session exists, we
            // return the user attached to that session
            // with a promise. This ensures that we can
            // always interface with this method asynchronously.

            // Optionally, if true is given as the fromServer parameter,
            // then this cached value will not be used.

            if (this.isAuthenticated() && fromServer !== true) {
                return $q.when(Session.user);
            }

            // Make request GET /session.
            // If it returns a user, call onSuccessfulLogin with the response.
            // If it returns a 401 response, we catch it and instead resolve to null.
            return $http.get('/session').then(onSuccessfulLogin).catch(function () {
                return null;
            });
        };

        this.signup = function (credentials) {
            return $http.post('/signup', credentials).then(onSuccessfulLogin).catch(function () {
                return $q.reject({ message: 'Signup was unsuccessful.' });
            });
        };

        this.login = function (credentials) {
            return $http.post('/login', credentials).then(onSuccessfulLogin).catch(function () {
                return $q.reject({ message: 'Invalid login credentials.' });
            });
        };

        this.logout = function () {
            return $http.get('/logout').then(function () {
                Session.destroy();
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            });
        };
    });

    app.service('Session', function ($rootScope, AUTH_EVENTS) {

        var self = this;

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function () {
            self.destroy();
        });

        $rootScope.$on(AUTH_EVENTS.sessionTimeout, function () {
            self.destroy();
        });

        this.user = null;

        this.create = function (user) {
            this.user = user;
        };

        this.destroy = function () {
            this.user = null;
        };
    });
})();

app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});

app.controller('HomeCtrl', function ($scope, AuthService, $log) {
    AuthService.getLoggedInUser().then(function (user) {
        if (!user) {
            $scope.loggedIn = false;
            $scope.user = {};
            $scope.user.firstName = 'friend';
        } else {
            $scope.loggedIn = true;
            $scope.user = user;
            if (!user.firstName) $scope.user.firstName = 'friend';
        }
    }).catch($log.error);
});

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

        AuthService.login(loginInfo).then(function () {
            $state.go('home');
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });
    };
});

app.config(function ($stateProvider) {

    $stateProvider.state('membersOnly', {
        url: '/members-area',
        template: '<img ng-repeat="item in stash" width="300" ng-src="{{ item }}" />',
        controller: function controller($scope, SecretStash) {
            SecretStash.getStash().then(function (stash) {
                $scope.stash = stash;
            });
        },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });
});

app.factory('SecretStash', function ($http) {

    var getStash = function getStash() {
        return $http.get('/api/users/secret-stash').then(function (response) {
            return response.data;
        });
    };

    return {
        getStash: getStash
    };
});

app.config(function ($stateProvider) {
    $stateProvider.state('plant', {
        url: '/plant/:id',
        templateUrl: 'js/plant/plant.html',
        controller: 'PlantCtrl'
    });
});

app.factory('PlantFactory', function ($http, $log) {
    var returnObj = {};

    returnObj.fetchOne = function (id) {
        return $http.get('/api/plants/' + id).then(function (plant) {
            return plant.data;
        }).catch($log.error);
    };

    return returnObj;
});

app.controller('PlantCtrl', function (PlantFactory, $scope, $stateParams, $log) {
    PlantFactory.fetchOne($stateParams.id).then(function (plant) {
        $scope.plant = plant;
    }).catch($log.error);
});

app.config(function ($stateProvider) {
    $stateProvider.state('plants', {
        url: '/plants',
        templateUrl: 'js/plants/plants.html',
        controller: 'PlantsCtrl'
    });
});

app.factory('PlantsFactory', function ($http, $log) {
    var returnObj = {};

    returnObj.fetchAll = function () {
        return $http.get('/api/plants/').then(function (plants) {
            return plants.data;
        }).catch($log.error);
    };

    return returnObj;
});

app.controller('PlantsCtrl', function ($scope, PlantsFactory, $log) {
    PlantsFactory.fetchAll().then(function (plants) {
        $scope.plants = plants.sort();
    }).catch($log.error);
});

app.config(function ($stateProvider) {
    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'js/signup/signup.html',
        controller: 'SignupCtrl'
    });
});

app.controller('SignupCtrl', function (SignupFactory, $log, $scope) {
    $scope.createUser = SignupFactory.createUser;
});

app.factory('SignupFactory', function ($state, $log, AuthService) {
    var returnObj = {};

    returnObj.createUser = function (userData) {
        AuthService.signup(userData).then(function () {
            $state.go('user-plots');
        }).catch($log.error);
    };

    return returnObj;
});

app.config(function ($stateProvider) {
    $stateProvider.state('user-plots', {
        url: '/myplots',
        templateUrl: 'js/user-plots/user-plots.html',
        controller: 'UserPlotsCtrl',
        data: {
            authenticate: true
        }
    });
});

app.factory('UserPlotsFactory', function ($http, $log) {
    var returnObj = {};

    returnObj.fetchUserPlots = function (userId) {
        return $http.get('/api/users/' + userId + '/plots').then(function (plots) {
            return plots.data;
        }).catch($log.error);
    };

    return returnObj;
});

app.controller('UserPlotsCtrl', function (UserPlotsFactory, $scope, $log, AuthService) {
    AuthService.getLoggedInUser().then(function (user) {
        $scope.user = user;

        UserPlotsFactory.fetchUserPlots($scope.user.id).then(function (plots) {
            $scope.plots = plots;
        }).catch($log.error);
    }).catch($log.error);
});

app.factory('FullstackPics', function () {
    return ['https://pbs.twimg.com/media/B7gBXulCAAAXQcE.jpg:large', 'https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-xap1/t31.0-8/10862451_10205622990359241_8027168843312841137_o.jpg', 'https://pbs.twimg.com/media/B-LKUshIgAEy9SK.jpg', 'https://pbs.twimg.com/media/B79-X7oCMAAkw7y.jpg', 'https://pbs.twimg.com/media/B-Uj9COIIAIFAh0.jpg:large', 'https://pbs.twimg.com/media/B6yIyFiCEAAql12.jpg:large', 'https://pbs.twimg.com/media/CE-T75lWAAAmqqJ.jpg:large', 'https://pbs.twimg.com/media/CEvZAg-VAAAk932.jpg:large', 'https://pbs.twimg.com/media/CEgNMeOXIAIfDhK.jpg:large', 'https://pbs.twimg.com/media/CEQyIDNWgAAu60B.jpg:large', 'https://pbs.twimg.com/media/CCF3T5QW8AE2lGJ.jpg:large', 'https://pbs.twimg.com/media/CAeVw5SWoAAALsj.jpg:large', 'https://pbs.twimg.com/media/CAaJIP7UkAAlIGs.jpg:large', 'https://pbs.twimg.com/media/CAQOw9lWEAAY9Fl.jpg:large', 'https://pbs.twimg.com/media/B-OQbVrCMAANwIM.jpg:large', 'https://pbs.twimg.com/media/B9b_erwCYAAwRcJ.png:large', 'https://pbs.twimg.com/media/B5PTdvnCcAEAl4x.jpg:large', 'https://pbs.twimg.com/media/B4qwC0iCYAAlPGh.jpg:large', 'https://pbs.twimg.com/media/B2b33vRIUAA9o1D.jpg:large', 'https://pbs.twimg.com/media/BwpIwr1IUAAvO2_.jpg:large', 'https://pbs.twimg.com/media/BsSseANCYAEOhLw.jpg:large', 'https://pbs.twimg.com/media/CJ4vLfuUwAAda4L.jpg:large', 'https://pbs.twimg.com/media/CI7wzjEVEAAOPpS.jpg:large', 'https://pbs.twimg.com/media/CIdHvT2UsAAnnHV.jpg:large', 'https://pbs.twimg.com/media/CGCiP_YWYAAo75V.jpg:large', 'https://pbs.twimg.com/media/CIS4JPIWIAI37qu.jpg:large'];
});

app.factory('RandomGreetings', function () {

    var getRandomFromArray = function getRandomFromArray(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    };

    var greetings = ['Hello, world!', 'At long last, I live!', 'Hello, simple human.', 'What a beautiful day!', 'I\'m like any other project, except that I am yours. :)', 'This empty string is for Lindsay Levine.', 'こんにちは、ユーザー様。', 'Welcome. To. WEBSITE.', ':D', 'Yes, I think we\'ve met before.', 'Gimme 3 mins... I just grabbed this really dope frittata', 'If Cooper could offer only one piece of advice, it would be to nevSQUIRREL!'];

    return {
        greetings: greetings,
        getRandomGreeting: function getRandomGreeting() {
            return getRandomFromArray(greetings);
        }
    };
});

app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, $state) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function link(scope) {

            scope.items = [{ label: 'Home', state: 'home' }, { label: 'About', state: 'about' }, { label: 'All the Plants', state: 'plants' }, { label: 'My Plots', state: 'user-plots', auth: true }];

            scope.user = null;

            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                    $state.go('home');
                });
            };

            var setUser = function setUser() {
                AuthService.getLoggedInUser().then(function (user) {
                    scope.user = user;
                });
            };

            var removeUser = function removeUser() {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);
        }

    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1hdGVyaWFsaXplLmpzIiwiYWJvdXQvYWJvdXQuanMiLCJmc2EvZnNhLXByZS1idWlsdC5qcyIsImhvbWUvaG9tZS5qcyIsImxvZ2luL2xvZ2luLmpzIiwibWVtYmVycy1vbmx5L21lbWJlcnMtb25seS5qcyIsInBsYW50L3BsYW50LmpzIiwicGxhbnRzL3BsYW50cy5qcyIsInNpZ251cC9zaWdudXAuanMiLCJ1c2VyLXBsb3RzL3VzZXItcGxvdHMuanMiLCJjb21tb24vZmFjdG9yaWVzL0Z1bGxzdGFja1BpY3MuanMiLCJjb21tb24vZmFjdG9yaWVzL1JhbmRvbUdyZWV0aW5ncy5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXZiYXIuanMiXSwibmFtZXMiOlsid2luZG93IiwiYXBwIiwiYW5ndWxhciIsIm1vZHVsZSIsImNvbmZpZyIsIiR1cmxSb3V0ZXJQcm92aWRlciIsIiRsb2NhdGlvblByb3ZpZGVyIiwiaHRtbDVNb2RlIiwib3RoZXJ3aXNlIiwid2hlbiIsImxvY2F0aW9uIiwicmVsb2FkIiwicnVuIiwiJHJvb3RTY29wZSIsIkF1dGhTZXJ2aWNlIiwiJHN0YXRlIiwiZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCIsInN0YXRlIiwiZGF0YSIsImF1dGhlbnRpY2F0ZSIsIiRvbiIsImV2ZW50IiwidG9TdGF0ZSIsInRvUGFyYW1zIiwiaXNBdXRoZW50aWNhdGVkIiwicHJldmVudERlZmF1bHQiLCJnZXRMb2dnZWRJblVzZXIiLCJ0aGVuIiwidXNlciIsImdvIiwibmFtZSIsIiQiLCJkb2N1bWVudCIsInJlYWR5Iiwic2lkZU5hdiIsIiRzdGF0ZVByb3ZpZGVyIiwidXJsIiwiY29udHJvbGxlciIsInRlbXBsYXRlVXJsIiwiJHNjb3BlIiwiRnVsbHN0YWNrUGljcyIsImltYWdlcyIsIl8iLCJzaHVmZmxlIiwiRXJyb3IiLCJmYWN0b3J5IiwiaW8iLCJvcmlnaW4iLCJjb25zdGFudCIsImxvZ2luU3VjY2VzcyIsImxvZ2luRmFpbGVkIiwibG9nb3V0U3VjY2VzcyIsInNlc3Npb25UaW1lb3V0Iiwibm90QXV0aGVudGljYXRlZCIsIm5vdEF1dGhvcml6ZWQiLCIkcSIsIkFVVEhfRVZFTlRTIiwic3RhdHVzRGljdCIsInJlc3BvbnNlRXJyb3IiLCJyZXNwb25zZSIsIiRicm9hZGNhc3QiLCJzdGF0dXMiLCJyZWplY3QiLCIkaHR0cFByb3ZpZGVyIiwiaW50ZXJjZXB0b3JzIiwicHVzaCIsIiRpbmplY3RvciIsImdldCIsInNlcnZpY2UiLCIkaHR0cCIsIlNlc3Npb24iLCJvblN1Y2Nlc3NmdWxMb2dpbiIsImNyZWF0ZSIsImZyb21TZXJ2ZXIiLCJjYXRjaCIsInNpZ251cCIsImNyZWRlbnRpYWxzIiwicG9zdCIsIm1lc3NhZ2UiLCJsb2dpbiIsImxvZ291dCIsImRlc3Ryb3kiLCJzZWxmIiwiJGxvZyIsImxvZ2dlZEluIiwiZmlyc3ROYW1lIiwiZXJyb3IiLCJzZW5kTG9naW4iLCJsb2dpbkluZm8iLCJ0ZW1wbGF0ZSIsIlNlY3JldFN0YXNoIiwiZ2V0U3Rhc2giLCJzdGFzaCIsInJldHVybk9iaiIsImZldGNoT25lIiwiaWQiLCJwbGFudCIsIlBsYW50RmFjdG9yeSIsIiRzdGF0ZVBhcmFtcyIsImZldGNoQWxsIiwicGxhbnRzIiwiUGxhbnRzRmFjdG9yeSIsInNvcnQiLCJTaWdudXBGYWN0b3J5IiwiY3JlYXRlVXNlciIsInVzZXJEYXRhIiwiZmV0Y2hVc2VyUGxvdHMiLCJ1c2VySWQiLCJwbG90cyIsIlVzZXJQbG90c0ZhY3RvcnkiLCJnZXRSYW5kb21Gcm9tQXJyYXkiLCJhcnIiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJsZW5ndGgiLCJncmVldGluZ3MiLCJnZXRSYW5kb21HcmVldGluZyIsImRpcmVjdGl2ZSIsInJlc3RyaWN0Iiwic2NvcGUiLCJsaW5rIiwiaXRlbXMiLCJsYWJlbCIsImF1dGgiLCJpc0xvZ2dlZEluIiwic2V0VXNlciIsInJlbW92ZVVzZXIiXSwibWFwcGluZ3MiOiJBQUFBOztBQUNBQSxP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QUEsVUFBQUMsSUFBQSxFQUFBO0FBQ0E0RiwwQkFBQTVGLElBQUEsR0FBQUEsSUFBQTtBQUNBLGlCQUZBO0FBR0EsYUFKQTs7QUFNQSxnQkFBQW1HLGFBQUEsU0FBQUEsVUFBQSxHQUFBO0FBQ0FQLHNCQUFBNUYsSUFBQSxHQUFBLElBQUE7QUFDQSxhQUZBOztBQUlBa0c7O0FBRUFqSCx1QkFBQU8sR0FBQSxDQUFBb0MsWUFBQVAsWUFBQSxFQUFBNkUsT0FBQTtBQUNBakgsdUJBQUFPLEdBQUEsQ0FBQW9DLFlBQUFMLGFBQUEsRUFBQTRFLFVBQUE7QUFDQWxILHVCQUFBTyxHQUFBLENBQUFvQyxZQUFBSixjQUFBLEVBQUEyRSxVQUFBO0FBRUE7O0FBekNBLEtBQUE7QUE2Q0EsQ0EvQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcbndpbmRvdy5hcHAgPSBhbmd1bGFyLm1vZHVsZSgnRnVsbHN0YWNrR2VuZXJhdGVkQXBwJywgWydmc2FQcmVCdWlsdCcsICd1aS5yb3V0ZXInLCAnbmdBbmltYXRlJywgJ25nQXJpYScsICduZ01hdGVyaWFsJywgJ2FuZ3VsYXIuZmlsdGVyJ10pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICAgLy8gVGhpcyB0dXJucyBvZmYgaGFzaGJhbmcgdXJscyAoLyNhYm91dCkgYW5kIGNoYW5nZXMgaXQgdG8gc29tZXRoaW5nIG5vcm1hbCAoL2Fib3V0KVxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAvLyBJZiB3ZSBnbyB0byBhIFVSTCB0aGF0IHVpLXJvdXRlciBkb2Vzbid0IGhhdmUgcmVnaXN0ZXJlZCwgZ28gdG8gdGhlIFwiL1wiIHVybC5cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG4gICAgLy8gVHJpZ2dlciBwYWdlIHJlZnJlc2ggd2hlbiBhY2Nlc3NpbmcgYW4gT0F1dGggcm91dGVcbiAgICAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignL2F1dGgvOnByb3ZpZGVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfSk7XG59KTtcblxuLy8gVGhpcyBhcHAucnVuIGlzIGZvciBjb250cm9sbGluZyBhY2Nlc3MgdG8gc3BlY2lmaWMgc3RhdGVzLlxuYXBwLnJ1bihmdW5jdGlvbiAoJHJvb3RTY29wZSwgQXV0aFNlcnZpY2UsICRzdGF0ZSkge1xuXG4gICAgLy8gVGhlIGdpdmVuIHN0YXRlIHJlcXVpcmVzIGFuIGF1dGhlbnRpY2F0ZWQgdXNlci5cbiAgICB2YXIgZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICByZXR1cm4gc3RhdGUuZGF0YSAmJiBzdGF0ZS5kYXRhLmF1dGhlbnRpY2F0ZTtcbiAgICB9O1xuXG4gICAgLy8gJHN0YXRlQ2hhbmdlU3RhcnQgaXMgYW4gZXZlbnQgZmlyZWRcbiAgICAvLyB3aGVuZXZlciB0aGUgcHJvY2VzcyBvZiBjaGFuZ2luZyBhIHN0YXRlIGJlZ2lucy5cbiAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zKSB7XG5cbiAgICAgICAgaWYgKCFkZXN0aW5hdGlvblN0YXRlUmVxdWlyZXNBdXRoKHRvU3RhdGUpKSB7XG4gICAgICAgICAgICAvLyBUaGUgZGVzdGluYXRpb24gc3RhdGUgZG9lcyBub3QgcmVxdWlyZSBhdXRoZW50aWNhdGlvblxuICAgICAgICAgICAgLy8gU2hvcnQgY2lyY3VpdCB3aXRoIHJldHVybi5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgICAgICAgICAgLy8gVGhlIHVzZXIgaXMgYXV0aGVudGljYXRlZC5cbiAgICAgICAgICAgIC8vIFNob3J0IGNpcmN1aXQgd2l0aCByZXR1cm4uXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDYW5jZWwgbmF2aWdhdGluZyB0byBuZXcgc3RhdGUuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgQXV0aFNlcnZpY2UuZ2V0TG9nZ2VkSW5Vc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgICAgLy8gSWYgYSB1c2VyIGlzIHJldHJpZXZlZCwgdGhlbiByZW5hdmlnYXRlIHRvIHRoZSBkZXN0aW5hdGlvblxuICAgICAgICAgICAgLy8gKHRoZSBzZWNvbmQgdGltZSwgQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkgd2lsbCB3b3JrKVxuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlLCBpZiBubyB1c2VyIGlzIGxvZ2dlZCBpbiwgZ28gdG8gXCJsb2dpblwiIHN0YXRlLlxuICAgICAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28odG9TdGF0ZS5uYW1lLCB0b1BhcmFtcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxufSk7XG4iLCIgLyogZXNsaW50LWRpc2FibGUgKi9cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgICQoXCIuYnV0dG9uLWNvbGxhcHNlXCIpLnNpZGVOYXYoKTtcbn0pO1xuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqYWJvdXQqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhYm91dCcsIHtcbiAgICAgICAgdXJsOiAnL2Fib3V0JyxcbiAgICAgICAgY29udHJvbGxlcjogJ0Fib3V0Q29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYWJvdXQvYWJvdXQuaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdBYm91dENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBGdWxsc3RhY2tQaWNzKSB7XG5cbiAgICAvLyBJbWFnZXMgb2YgYmVhdXRpZnVsIEZ1bGxzdGFjayBwZW9wbGUuXG4gICAgJHNjb3BlLmltYWdlcyA9IF8uc2h1ZmZsZShGdWxsc3RhY2tQaWNzKTtcblxufSk7XG4iLCIoZnVuY3Rpb24gKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gSG9wZSB5b3UgZGlkbid0IGZvcmdldCBBbmd1bGFyISBEdWgtZG95LlxuICAgIGlmICghd2luZG93LmFuZ3VsYXIpIHRocm93IG5ldyBFcnJvcignSSBjYW5cXCd0IGZpbmQgQW5ndWxhciEnKTtcblxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnZnNhUHJlQnVpbHQnLCBbXSk7XG5cbiAgICBhcHAuZmFjdG9yeSgnU29ja2V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXdpbmRvdy5pbykgdGhyb3cgbmV3IEVycm9yKCdzb2NrZXQuaW8gbm90IGZvdW5kIScpO1xuICAgICAgICByZXR1cm4gd2luZG93LmlvKHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pO1xuICAgIH0pO1xuXG4gICAgLy8gQVVUSF9FVkVOVFMgaXMgdXNlZCB0aHJvdWdob3V0IG91ciBhcHAgdG9cbiAgICAvLyBicm9hZGNhc3QgYW5kIGxpc3RlbiBmcm9tIGFuZCB0byB0aGUgJHJvb3RTY29wZVxuICAgIC8vIGZvciBpbXBvcnRhbnQgZXZlbnRzIGFib3V0IGF1dGhlbnRpY2F0aW9uIGZsb3cuXG4gICAgYXBwLmNvbnN0YW50KCdBVVRIX0VWRU5UUycsIHtcbiAgICAgICAgbG9naW5TdWNjZXNzOiAnYXV0aC1sb2dpbi1zdWNjZXNzJyxcbiAgICAgICAgbG9naW5GYWlsZWQ6ICdhdXRoLWxvZ2luLWZhaWxlZCcsXG4gICAgICAgIGxvZ291dFN1Y2Nlc3M6ICdhdXRoLWxvZ291dC1zdWNjZXNzJyxcbiAgICAgICAgc2Vzc2lvblRpbWVvdXQ6ICdhdXRoLXNlc3Npb24tdGltZW91dCcsXG4gICAgICAgIG5vdEF1dGhlbnRpY2F0ZWQ6ICdhdXRoLW5vdC1hdXRoZW50aWNhdGVkJyxcbiAgICAgICAgbm90QXV0aG9yaXplZDogJ2F1dGgtbm90LWF1dGhvcml6ZWQnXG4gICAgfSk7XG5cbiAgICBhcHAuZmFjdG9yeSgnQXV0aEludGVyY2VwdG9yJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRxLCBBVVRIX0VWRU5UUykge1xuICAgICAgICB2YXIgc3RhdHVzRGljdCA9IHtcbiAgICAgICAgICAgIDQwMTogQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCxcbiAgICAgICAgICAgIDQwMzogQVVUSF9FVkVOVFMubm90QXV0aG9yaXplZCxcbiAgICAgICAgICAgIDQxOTogQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsXG4gICAgICAgICAgICA0NDA6IEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3Qoc3RhdHVzRGljdFtyZXNwb25zZS5zdGF0dXNdLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZXNwb25zZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIGFwcC5jb25maWcoZnVuY3Rpb24gKCRodHRwUHJvdmlkZXIpIHtcbiAgICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaChbXG4gICAgICAgICAgICAnJGluamVjdG9yJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uICgkaW5qZWN0b3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGluamVjdG9yLmdldCgnQXV0aEludGVyY2VwdG9yJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgYXBwLnNlcnZpY2UoJ0F1dGhTZXJ2aWNlJywgZnVuY3Rpb24gKCRodHRwLCBTZXNzaW9uLCAkcm9vdFNjb3BlLCBBVVRIX0VWRU5UUywgJHEpIHtcblxuICAgICAgICBmdW5jdGlvbiBvblN1Y2Nlc3NmdWxMb2dpbihyZXNwb25zZSkge1xuICAgICAgICAgICAgdmFyIHVzZXIgPSByZXNwb25zZS5kYXRhLnVzZXI7XG4gICAgICAgICAgICBTZXNzaW9uLmNyZWF0ZSh1c2VyKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChBVVRIX0VWRU5UUy5sb2dpblN1Y2Nlc3MpO1xuICAgICAgICAgICAgcmV0dXJuIHVzZXI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVc2VzIHRoZSBzZXNzaW9uIGZhY3RvcnkgdG8gc2VlIGlmIGFuXG4gICAgICAgIC8vIGF1dGhlbnRpY2F0ZWQgdXNlciBpcyBjdXJyZW50bHkgcmVnaXN0ZXJlZC5cbiAgICAgICAgdGhpcy5pc0F1dGhlbnRpY2F0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gISFTZXNzaW9uLnVzZXI7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5nZXRMb2dnZWRJblVzZXIgPSBmdW5jdGlvbiAoZnJvbVNlcnZlcikge1xuXG4gICAgICAgICAgICAvLyBJZiBhbiBhdXRoZW50aWNhdGVkIHNlc3Npb24gZXhpc3RzLCB3ZVxuICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSB1c2VyIGF0dGFjaGVkIHRvIHRoYXQgc2Vzc2lvblxuICAgICAgICAgICAgLy8gd2l0aCBhIHByb21pc2UuIFRoaXMgZW5zdXJlcyB0aGF0IHdlIGNhblxuICAgICAgICAgICAgLy8gYWx3YXlzIGludGVyZmFjZSB3aXRoIHRoaXMgbWV0aG9kIGFzeW5jaHJvbm91c2x5LlxuXG4gICAgICAgICAgICAvLyBPcHRpb25hbGx5LCBpZiB0cnVlIGlzIGdpdmVuIGFzIHRoZSBmcm9tU2VydmVyIHBhcmFtZXRlcixcbiAgICAgICAgICAgIC8vIHRoZW4gdGhpcyBjYWNoZWQgdmFsdWUgd2lsbCBub3QgYmUgdXNlZC5cblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNBdXRoZW50aWNhdGVkKCkgJiYgZnJvbVNlcnZlciAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkcS53aGVuKFNlc3Npb24udXNlcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE1ha2UgcmVxdWVzdCBHRVQgL3Nlc3Npb24uXG4gICAgICAgICAgICAvLyBJZiBpdCByZXR1cm5zIGEgdXNlciwgY2FsbCBvblN1Y2Nlc3NmdWxMb2dpbiB3aXRoIHRoZSByZXNwb25zZS5cbiAgICAgICAgICAgIC8vIElmIGl0IHJldHVybnMgYSA0MDEgcmVzcG9uc2UsIHdlIGNhdGNoIGl0IGFuZCBpbnN0ZWFkIHJlc29sdmUgdG8gbnVsbC5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9zZXNzaW9uJykudGhlbihvblN1Y2Nlc3NmdWxMb2dpbikuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnNpZ251cCA9IGZ1bmN0aW9uKGNyZWRlbnRpYWxzKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvc2lnbnVwJywgY3JlZGVudGlhbHMpXG4gICAgICAgICAgICAgICAgLnRoZW4ob25TdWNjZXNzZnVsTG9naW4pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHsgbWVzc2FnZTogJ1NpZ251cCB3YXMgdW5zdWNjZXNzZnVsLid9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxvZ2luID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2xvZ2luJywgY3JlZGVudGlhbHMpXG4gICAgICAgICAgICAgICAgLnRoZW4ob25TdWNjZXNzZnVsTG9naW4pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdCh7IG1lc3NhZ2U6ICdJbnZhbGlkIGxvZ2luIGNyZWRlbnRpYWxzLicgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvbG9nb3V0JykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgU2Vzc2lvbi5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KEFVVEhfRVZFTlRTLmxvZ291dFN1Y2Nlc3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxuICAgIGFwcC5zZXJ2aWNlKCdTZXNzaW9uJywgZnVuY3Rpb24gKCRyb290U2NvcGUsIEFVVEhfRVZFTlRTKSB7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKEFVVEhfRVZFTlRTLm5vdEF1dGhlbnRpY2F0ZWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYuZGVzdHJveSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudXNlciA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgICAgdGhpcy51c2VyID0gdXNlcjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnVzZXIgPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0oKSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdob21lJywge1xuICAgICAgICB1cmw6ICcvJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9ob21lL2hvbWUuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ3RybCdcbiAgICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignSG9tZUN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBBdXRoU2VydmljZSwgJGxvZykge1xuICAgIEF1dGhTZXJ2aWNlLmdldExvZ2dlZEluVXNlcigpXG4gICAgLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgICAkc2NvcGUubG9nZ2VkSW4gPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS51c2VyID0ge307XG4gICAgICAgICAgICAkc2NvcGUudXNlci5maXJzdE5hbWUgPSAnZnJpZW5kJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRzY29wZS5sb2dnZWRJbiA9IHRydWU7XG4gICAgICAgICAgICAkc2NvcGUudXNlciA9IHVzZXI7XG4gICAgICAgICAgICBpZiAoIXVzZXIuZmlyc3ROYW1lKSAkc2NvcGUudXNlci5maXJzdE5hbWUgPSAnZnJpZW5kJztcbiAgICAgICAgfVxuICAgIH0pXG4gICAgLmNhdGNoKCRsb2cuZXJyb3IpO1xufSk7XG5cbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbG9naW4nLCB7XG4gICAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvbG9naW4vbG9naW4uaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgQXV0aFNlcnZpY2UsICRzdGF0ZSkge1xuXG4gICAgJHNjb3BlLmxvZ2luID0ge307XG4gICAgJHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICRzY29wZS5zZW5kTG9naW4gPSBmdW5jdGlvbiAobG9naW5JbmZvKSB7XG5cbiAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICAgICBBdXRoU2VydmljZS5sb2dpbihsb2dpbkluZm8pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9ICdJbnZhbGlkIGxvZ2luIGNyZWRlbnRpYWxzLic7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ21lbWJlcnNPbmx5Jywge1xuICAgICAgICB1cmw6ICcvbWVtYmVycy1hcmVhJyxcbiAgICAgICAgdGVtcGxhdGU6ICc8aW1nIG5nLXJlcGVhdD1cIml0ZW0gaW4gc3Rhc2hcIiB3aWR0aD1cIjMwMFwiIG5nLXNyYz1cInt7IGl0ZW0gfX1cIiAvPicsXG4gICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkc2NvcGUsIFNlY3JldFN0YXNoKSB7XG4gICAgICAgICAgICBTZWNyZXRTdGFzaC5nZXRTdGFzaCgpLnRoZW4oZnVuY3Rpb24gKHN0YXNoKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnN0YXNoID0gc3Rhc2g7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBkYXRhLmF1dGhlbnRpY2F0ZSBpcyByZWFkIGJ5IGFuIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgIC8vIHRoYXQgY29udHJvbHMgYWNjZXNzIHRvIHRoaXMgc3RhdGUuIFJlZmVyIHRvIGFwcC5qcy5cbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgYXV0aGVudGljYXRlOiB0cnVlXG4gICAgICAgIH1cbiAgICB9KTtcblxufSk7XG5cbmFwcC5mYWN0b3J5KCdTZWNyZXRTdGFzaCcsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG4gICAgdmFyIGdldFN0YXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3VzZXJzL3NlY3JldC1zdGFzaCcpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldFN0YXNoOiBnZXRTdGFzaFxuICAgIH07XG5cbn0pO1xuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdwbGFudCcsIHtcbiAgICAgICAgdXJsOiAnL3BsYW50LzppZCcsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvcGxhbnQvcGxhbnQuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdQbGFudEN0cmwnXG4gICAgfSk7XG59KTtcblxuYXBwLmZhY3RvcnkoJ1BsYW50RmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwLCAkbG9nKSB7XG5cdHZhciByZXR1cm5PYmogPSB7fTtcblxuXHRyZXR1cm5PYmouZmV0Y2hPbmUgPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvcGxhbnRzLycgKyBpZClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24ocGxhbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBwbGFudC5kYXRhO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goJGxvZy5lcnJvcik7XG5cdH07XG5cblx0cmV0dXJuIHJldHVybk9iajtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignUGxhbnRDdHJsJywgZnVuY3Rpb24oUGxhbnRGYWN0b3J5LCAkc2NvcGUsICRzdGF0ZVBhcmFtcywgJGxvZykge1xuXHRQbGFudEZhY3RvcnkuZmV0Y2hPbmUoJHN0YXRlUGFyYW1zLmlkKVxuXHQudGhlbihmdW5jdGlvbihwbGFudCkge1xuXHRcdCRzY29wZS5wbGFudCA9IHBsYW50O1xuXHR9KVxuXHQuY2F0Y2goJGxvZy5lcnJvcik7XG59KTtcbiIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncGxhbnRzJywge1xuICAgICAgICB1cmw6ICcvcGxhbnRzJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9wbGFudHMvcGxhbnRzLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnUGxhbnRzQ3RybCdcbiAgICB9KTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnUGxhbnRzRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwLCAkbG9nKSB7XG5cdHZhciByZXR1cm5PYmogPSB7fTtcblxuXHRyZXR1cm5PYmouZmV0Y2hBbGwgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3BsYW50cy8nKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHBsYW50cykge1xuXHRcdFx0cmV0dXJuIHBsYW50cy5kYXRhO1xuXHRcdH0pXG5cdFx0LmNhdGNoKCRsb2cuZXJyb3IpO1xuXHR9O1xuXG5cdHJldHVybiByZXR1cm5PYmo7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1BsYW50c0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIFBsYW50c0ZhY3RvcnksICRsb2cpIHtcblx0UGxhbnRzRmFjdG9yeS5mZXRjaEFsbCgpXG5cdC50aGVuKGZ1bmN0aW9uKHBsYW50cykge1xuXHRcdCRzY29wZS5wbGFudHMgPSBwbGFudHMuc29ydCgpO1xuXHR9KVxuXHQuY2F0Y2goJGxvZy5lcnJvcik7XG5cbn0pO1xuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzaWdudXAnLCB7XG4gICAgICAgIHVybDogJy9zaWdudXAnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3NpZ251cC9zaWdudXAuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTaWdudXBDdHJsJ1xuICAgIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdTaWdudXBDdHJsJywgZnVuY3Rpb24oU2lnbnVwRmFjdG9yeSwgJGxvZywgJHNjb3BlKSB7XG4gICAgJHNjb3BlLmNyZWF0ZVVzZXIgPSBTaWdudXBGYWN0b3J5LmNyZWF0ZVVzZXI7XG59KTtcblxuYXBwLmZhY3RvcnkoJ1NpZ251cEZhY3RvcnknLCBmdW5jdGlvbigkc3RhdGUsICRsb2csIEF1dGhTZXJ2aWNlKSB7XG4gICAgdmFyIHJldHVybk9iaiA9IHt9O1xuXG4gICAgcmV0dXJuT2JqLmNyZWF0ZVVzZXIgPSBmdW5jdGlvbih1c2VyRGF0YSkge1xuICAgICAgICBBdXRoU2VydmljZS5zaWdudXAodXNlckRhdGEpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHN0YXRlLmdvKCd1c2VyLXBsb3RzJyk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgkbG9nLmVycm9yKVxuICAgIH07XG5cbiAgICByZXR1cm4gcmV0dXJuT2JqO1xufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd1c2VyLXBsb3RzJywge1xuICAgICAgICB1cmw6ICcvbXlwbG90cycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdXNlci1wbG90cy91c2VyLXBsb3RzLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnVXNlclBsb3RzQ3RybCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGF1dGhlbnRpY2F0ZTogdHJ1ZVxuICAgICAgICB9XG4gICAgfSk7XG59KTtcblxuYXBwLmZhY3RvcnkoJ1VzZXJQbG90c0ZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCwgJGxvZykge1xuICAgIHZhciByZXR1cm5PYmogPSB7fTtcblxuICAgIHJldHVybk9iai5mZXRjaFVzZXJQbG90cyA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3VzZXJzLycgKyB1c2VySWQgICsgJy9wbG90cycpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHBsb3RzKSB7XG4gICAgICAgICAgICByZXR1cm4gcGxvdHMuZGF0YTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKCRsb2cuZXJyb3IpO1xuICAgIH07XG5cbiAgICByZXR1cm4gcmV0dXJuT2JqO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdVc2VyUGxvdHNDdHJsJywgZnVuY3Rpb24oVXNlclBsb3RzRmFjdG9yeSwgJHNjb3BlLCAkbG9nLCBBdXRoU2VydmljZSkge1xuICAgIEF1dGhTZXJ2aWNlLmdldExvZ2dlZEluVXNlcigpXG4gICAgLnRoZW4oZnVuY3Rpb24odXNlcikge1xuICAgICAgICAkc2NvcGUudXNlciA9IHVzZXI7XG5cbiAgICAgICAgVXNlclBsb3RzRmFjdG9yeS5mZXRjaFVzZXJQbG90cygkc2NvcGUudXNlci5pZClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24ocGxvdHMpIHtcbiAgICAgICAgICAgICRzY29wZS5wbG90cyA9IHBsb3RzO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goJGxvZy5lcnJvcik7XG4gICAgfSlcbiAgICAuY2F0Y2goJGxvZy5lcnJvcik7XG59KTtcbiIsImFwcC5mYWN0b3J5KCdGdWxsc3RhY2tQaWNzJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBbXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjdnQlh1bENBQUFYUWNFLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL2ZiY2RuLXNwaG90b3MtYy1hLmFrYW1haWhkLm5ldC9ocGhvdG9zLWFrLXhhcDEvdDMxLjAtOC8xMDg2MjQ1MV8xMDIwNTYyMjk5MDM1OTI0MV84MDI3MTY4ODQzMzEyODQxMTM3X28uanBnJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CLUxLVXNoSWdBRXk5U0suanBnJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CNzktWDdvQ01BQWt3N3kuanBnJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CLVVqOUNPSUlBSUZBaDAuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CNnlJeUZpQ0VBQXFsMTIuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9DRS1UNzVsV0FBQW1xcUouanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9DRXZaQWctVkFBQWs5MzIuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9DRWdOTWVPWElBSWZEaEsuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9DRVF5SUROV2dBQXU2MEIuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9DQ0YzVDVRVzhBRTJsR0ouanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9DQWVWdzVTV29BQUFMc2ouanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9DQWFKSVA3VWtBQWxJR3MuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9DQVFPdzlsV0VBQVk5RmwuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CLU9RYlZyQ01BQU53SU0uanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9COWJfZXJ3Q1lBQXdSY0oucG5nOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CNVBUZHZuQ2NBRUFsNHguanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CNHF3QzBpQ1lBQWxQR2guanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CMmIzM3ZSSVVBQTlvMUQuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9Cd3BJd3IxSVVBQXZPMl8uanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9Cc1NzZUFOQ1lBRU9oTHcuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9DSjR2TGZ1VXdBQWRhNEwuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9DSTd3empFVkVBQU9QcFMuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9DSWRIdlQyVXNBQW5uSFYuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9DR0NpUF9ZV1lBQW83NVYuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9DSVM0SlBJV0lBSTM3cXUuanBnOmxhcmdlJ1xuICAgIF07XG59KTtcbiIsImFwcC5mYWN0b3J5KCdSYW5kb21HcmVldGluZ3MnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgZ2V0UmFuZG9tRnJvbUFycmF5ID0gZnVuY3Rpb24gKGFycikge1xuICAgICAgICByZXR1cm4gYXJyW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFyci5sZW5ndGgpXTtcbiAgICB9O1xuXG4gICAgdmFyIGdyZWV0aW5ncyA9IFtcbiAgICAgICAgJ0hlbGxvLCB3b3JsZCEnLFxuICAgICAgICAnQXQgbG9uZyBsYXN0LCBJIGxpdmUhJyxcbiAgICAgICAgJ0hlbGxvLCBzaW1wbGUgaHVtYW4uJyxcbiAgICAgICAgJ1doYXQgYSBiZWF1dGlmdWwgZGF5IScsXG4gICAgICAgICdJXFwnbSBsaWtlIGFueSBvdGhlciBwcm9qZWN0LCBleGNlcHQgdGhhdCBJIGFtIHlvdXJzLiA6KScsXG4gICAgICAgICdUaGlzIGVtcHR5IHN0cmluZyBpcyBmb3IgTGluZHNheSBMZXZpbmUuJyxcbiAgICAgICAgJ+OBk+OCk+OBq+OBoeOBr+OAgeODpuODvOOCtuODvOanmOOAgicsXG4gICAgICAgICdXZWxjb21lLiBUby4gV0VCU0lURS4nLFxuICAgICAgICAnOkQnLFxuICAgICAgICAnWWVzLCBJIHRoaW5rIHdlXFwndmUgbWV0IGJlZm9yZS4nLFxuICAgICAgICAnR2ltbWUgMyBtaW5zLi4uIEkganVzdCBncmFiYmVkIHRoaXMgcmVhbGx5IGRvcGUgZnJpdHRhdGEnLFxuICAgICAgICAnSWYgQ29vcGVyIGNvdWxkIG9mZmVyIG9ubHkgb25lIHBpZWNlIG9mIGFkdmljZSwgaXQgd291bGQgYmUgdG8gbmV2U1FVSVJSRUwhJyxcbiAgICBdO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ3JlZXRpbmdzOiBncmVldGluZ3MsXG4gICAgICAgIGdldFJhbmRvbUdyZWV0aW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0UmFuZG9tRnJvbUFycmF5KGdyZWV0aW5ncyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KTtcbiIsImFwcC5kaXJlY3RpdmUoJ25hdmJhcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCBBdXRoU2VydmljZSwgQVVUSF9FVkVOVFMsICRzdGF0ZSkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IHt9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXZiYXIuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSkge1xuXG4gICAgICAgICAgICBzY29wZS5pdGVtcyA9IFtcbiAgICAgICAgICAgICAgICB7IGxhYmVsOiAnSG9tZScsIHN0YXRlOiAnaG9tZScgfSxcbiAgICAgICAgICAgICAgICB7IGxhYmVsOiAnQWJvdXQnLCBzdGF0ZTogJ2Fib3V0JyB9LFxuICAgICAgICAgICAgICAgIHsgbGFiZWw6ICdBbGwgdGhlIFBsYW50cycsIHN0YXRlOiAncGxhbnRzJyB9LFxuICAgICAgICAgICAgICAgIHsgbGFiZWw6ICdNeSBQbG90cycsIHN0YXRlOiAndXNlci1wbG90cycsIGF1dGg6IHRydWUgfVxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgc2NvcGUudXNlciA9IG51bGw7XG5cbiAgICAgICAgICAgIHNjb3BlLmlzTG9nZ2VkSW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIHNldFVzZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgQXV0aFNlcnZpY2UuZ2V0TG9nZ2VkSW5Vc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS51c2VyID0gdXNlcjtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciByZW1vdmVVc2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNjb3BlLnVzZXIgPSBudWxsO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgc2V0VXNlcigpO1xuXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5sb2dpblN1Y2Nlc3MsIHNldFVzZXIpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubG9nb3V0U3VjY2VzcywgcmVtb3ZlVXNlcik7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dCwgcmVtb3ZlVXNlcik7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
