app.config(function ($stateProvider) {
    $stateProvider.state('create', {
        url: '/create',
        templateUrl: 'js/create/create.html',
        controller: 'CreateCtrl',
    });
});

app.controller('CreateCtrl', function ($scope, $log, CreatePlotFactory, PlantsFactory) {

    var sortByName = function (a, b) {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    }

    var createPlantOptions = function () {
        PlantsFactory.fetchAll()
        .then(function (plants) {
            var largePlants = [];
            var fitPlants = plants.filter(function(plant){
                if ((plant.height * plant.width) > $scope.area) {
                    largePlants.push(plant);
                    return false;
                } else {
                    return true;
                }
            })
            $scope.optionsList = fitPlants.sort(sortByName);
            $scope.largePlants = largePlants.sort(sortByName);
        })
        .catch($log.error);
    };

    $scope.totalPlantArea = 0;

    $scope.switch = false;

    $scope.feet = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    $scope.inches = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    $scope.createPlot = function (hf, hi, wf, wi) {
        if ( hf === undefined) hf = 0;
        if ( hi === undefined) hi = 0;
        if ( wf === undefined) wf = 0;
        if ( wi === undefined) wi = 0;
        CreatePlotFactory.setHeightAndWidth(hf, hi, wf, wi);
        $scope.area = (((+hf * 12) + (+hi)) * ((+wf * 12) + (+wi)));
        createPlantOptions();
        $scope.switch = true;
    };

    $scope.createPlantList = function (selectedPlants) {
        CreatePlotFactory.userPlantList(selectedPlants);
    };

    // below is not yet functioning:
    $scope.afterSelectItem = function (item) {
        $scope.totalPlantArea += (item.height * item.width);
    };
    $scope.afterRemoveItem = function(item) {
        $scope.totalPlantArea += (item.height * item.width);
    };
    $scope.plantsDontFit = ($scope.plantArea >= $scope.area);

});

app.factory('CreatePlotFactory', function () {
    var returnObj = {};

    returnObj.Cell = function () {
        this.sun = 2;
        this.sunniness = 'sun';
        this.taken = false;
    };

    returnObj.setHeightAndWidth = function(hf, hi, wf, wi) {
        returnObj.height = (+hf * 12) + (+hi);
        returnObj.width = (+wf * 12) + (+wi);
    }

    returnObj.createPlot = function (height, width){
        const plot = [];
        for (var i = 0; i < height; i++) {
            const row = [];
            for (var j = 0; j < width; j++) {
                row.push(new returnObj.Cell());
            }
            plot.push(row);
        }
        returnObj.plot = plot;
        return plot;
    };

    returnObj.userPlantList = function (usersPlants) {
        returnObj.usersPlants = usersPlants;
    };

    // returnObj.renderPlot = function (plotData) {
    //     //send plot data to backend
    //     //plot data will be 2 params
    //     //1 array of objects {sun: 0/1/2, taken:false} (returnObj.plot);
    //     //2 array of plants, full plant object (returnObj.usersPlants);
    // }

    return returnObj;
});
