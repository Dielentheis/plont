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
        $scope.user = user;
    })
    .catch($log.error);

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
            });
            $scope.optionsList = fitPlants.sort(PlantsFactory.sortByName);
            $scope.largePlants = largePlants.sort(PlantsFactory.sortByName);
        })
        .catch($log.error);
    };

    $scope.totalPlantArea = 0;

    $scope.switch = false;
    $scope.error = false;

    $scope.inches = [ 12, 18, 24, 30, 36, 42, 48, 54];

    $scope.createPlot = function (hi, wi, name) {
        hi = parseInt(hi, 10);
        wi = parseInt(wi, 10);
        CreatePlotFactory.setHeightAndWidth(hi, wi);
        CreatePlotFactory.setPlotName(name);
        $scope.area = (+hi * +wi);
        createPlantOptions();
        $scope.switch = true;
    };

    $scope.createPlantList = function (selectedPlants) {
        CreatePlotFactory.userPlantList(selectedPlants);
        const plantIds = [];
        selectedPlants.forEach(function (obj) {
            plantIds.push(obj.id);
        });
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
    };

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
