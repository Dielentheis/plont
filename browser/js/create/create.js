app.config(function ($stateProvider) {
    $stateProvider.state('create', {
        url: '/create',
        templateUrl: 'js/create/create.html',
        controller: 'CreateCtrl',
    });
});

app.controller('CreateCtrl', function ($scope, CreatePlotFactory) {
    $scope.plot = {};
    $scope.feet = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    $scope.inches = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    //NOTE end of day 10/6 ---> this function is wrong!!!!
    $scope.createPlot = function (){
        let height = ($scope.heightFeet * 12) + $scope.heightInches;
        let width = ($scope.widthFeet * 12) + $scope.widthInches;
        let plot = [];
        for (var i = 0; i < height; i++) {
            let row = [];
            for (var j = 0; j < width; j++) {
                let cell = new CreatePlotFactory.Cell();
                row.push(cell)
            }
            plot.push(row);
        }
        $scope.plot = plot;
        console.log($scope.plot);
    }
});

app.factory('CreatePlotFactory', function () {
    var returnObj = {};

    returnObj.Cell =function () {
        this.sun = 0;
        this.taken = false;
    };

    // returnObj.renderPlot = function (plotData) {
    //     //send plot data to backend
    //     //plot data will be 2 params
    //     //1 array of objects {sun: 0/1/2, taken:false}
    //     //2 array of plants, either full plant obj or plant id
    // }

    return returnObj;
});
