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

app.controller('UserPlotsCtrl', function(UserPlotsFactory, $scope, $log, $state, AuthService, $mdDialog, $window) {
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

    $scope.removePlot = function(plotId, plotName) {
        console.log("click logged");
        UserPlotsFactory.remove(plotId)
        .then(function() {
            tellUserDeleted(plotName);
        })
        .catch($log.error);
    }

    function tellUserDeleted(name) {
        console.log("supposed to tell");
        var confirm = $mdDialog.confirm()
            .title('Plot Deleted')
            .htmlContent('\'' + name + '\' was successfully deleted!')
            .ariaLabel('Plot deletion confirmation')
            .clickOutsideToClose(true)
            .ok('OK');
            
        $mdDialog.show(confirm)
        .then(function() {
            console.log("gonna get");
            return UserPlotsFactory.fetchUserPlots($scope.user.id)
        })
        .then(function(plots) {
            $scope.plots = plots;
            console.log("shoulda refreshed");
        })
        .catch($log.error);
    }
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

    returnObj.remove = function(plotId) {
        return $http.delete('/api/plots/' + plotId)
        .then(function(deletedPlot){
            return deletedPlot.data;
        })
        .catch($log.error);
    }

    return returnObj;
});
