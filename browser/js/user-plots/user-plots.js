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

app.factory('UserPlotsFactory', function($http, $log) {
    var returnObj = {};

    returnObj.fetchUserPlots = function(userId) {
        return $http.get('/api/users/' + userId  + '/plots')
        .then(function(plots) {
            return plots.data;
        })
        .catch($log.error);
    };

    return returnObj;
});

app.controller('UserPlotsCtrl', function(UserPlotsFactory, $scope, $log, $state, AuthService) {
    $scope.user = {};
    AuthService.getLoggedInUser()
    .then(function(user) {
        $scope.user = user;
        return UserPlotsFactory.fetchUserPlots($scope.user.id)
    })
    .then(function(plots) {
        $scope.plots = plots;
    })
    .catch($log.error);

    $scope.toPlot = function(plotId) {
        $state.go('plot', {id: plotId});
    }
});
