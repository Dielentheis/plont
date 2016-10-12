app.config(function ($stateProvider) {
    $stateProvider.state('create', {
        url: '/create',
        templateUrl: 'js/create/create.html',
        controller: 'CreateCtrl',
    });
});

app.controller('CreateCtrl', function ($scope, $log, CreatePlotFactory, PlantsFactory, PlantFactory, AuthService, $state) {

    AuthService.getLoggedInUser()
    .then(function (user) {
        $scope.user = user
    })
    .catch($log.error);

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
    $scope.error = false;

    $scope.inches = [ 12, 18, 24, 30, 36, 42, 48, 54];

    $scope.createPlot = function (hi, wi, name) {
        if (!hi || !wi) throw new Error('Height and Width are required');
        CreatePlotFactory.setHeightAndWidth(hi, wi);
        CreatePlotFactory.setPlotName(name);
        $scope.area = (+hi * +wi);
        createPlantOptions();
        $scope.switch = true;
    };

    $scope.createPlantList = function (selectedPlants) {
        if (selectedPlants.length > 10){
            $scope.message = 'Please select ten or fewer plants.';
            $scope.error = true;
            throw new Error('Maximum plant count allowed is 10');
        }
        if (selectedPlants.length < 1) {
            $scope.message = 'Please select at least one plant.'
            $scope.error = true;
            throw new Error('At least one plant must be selected');
        }
        CreatePlotFactory.userPlantList(selectedPlants);
        let plantIds = []
        selectedPlants.forEach(function (obj) {
            plantIds.push(obj.id);
        })
        PlantFactory.addToUser($scope.user.id, plantIds);
        $state.go('sunmap');
    };

});

app.factory('CreatePlotFactory', function () {
    var returnObj = {};

    returnObj.Cell = function () {
        this.sun = 2;
        this.sunniness = 'sun';
        this.taken = false;
    };

    returnObj.setHeightAndWidth = function(hi, wi) {
        returnObj.height = +hi;
        returnObj.width = +wi;
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

    returnObj.setPlotName = function (plotName) {
        if (!plotName) plotName = 'Unnamed Plot';
        returnObj.plotName = plotName;
    };

    return returnObj;
});
