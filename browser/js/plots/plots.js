app.config(function ($stateProvider) {
    $stateProvider.state('plots', {
        url: '/plot',
        templateUrl: 'js/user-plots/plots.html',
        controller: 'PlotsCtrl',
    });
})

app.controller('PlotsCtrl', function ($scope) {
    $scope.plot = {};
})
