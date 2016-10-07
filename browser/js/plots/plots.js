app.config(function ($stateProvider) {
    $stateProvider.state('plots', {
        url: '/plot',
        templateUrl: 'js/user-plots/plots.html',
        controller: 'PlotsCtrl',
    });
});

app.controller('PlotsCtrl', function ($scope, PlotsFactory) {
    $scope.plot = {};
    $scope.makePlot = PlotsFactory.makesThenStoresThenRedirects;
});

app.factory('PlotsFactory', function($http, $state) {
    var returnObj = {};

    returnObj.makesThenStoresThenRedirects = function(plot, plants) {
        plot = returnObj.makePlot(plot, plants);
        $http.post('/api/plots/', {height: plot.length, width: plot[0].length, layout: plot})
        .then(function(savedPlot) {
            $state.go('plot({id: savedPlot.id})');
        });
    };

    returnObj.makePlot = function(plot, plants) {
        var plotArea = plot.length * plot[0].length;
        var numPlants = plants.length;
        var approxPlantArea = plotArea / numPlants;

        assignNumPlantsToPlant(approxPlantArea, plants);
        plants.sort(orderByBiggest);
        plants.forEach(function(plant) {
            for (var i = 0; i < plant.numToPlant; i++) {
                findSpaceAndPlant(plant);
            }
        });
        fillInExtraSpace(plants);

        return plot;

        function orderByBiggest(a, b) {
            return (a.height * a.width) <= (b.height * b.width);
        }

        function assignNumPlantsToPlant() {
            plants.forEach(function(plant) {
                var plantArea = plant.height * plant.width;
                var numPlantsToPlant = Math.floor(approxPlantArea / plantArea);
                plant["numToPlant"] = numPlantsToPlant;
            });
            return plants;
        }

        function findSpaceAndPlant(plant) {
            var plotHeight = plot.length;
            var rowLength = plot[0].length;
            var width = plant.width;
            var height = plant.height;

            for (var i = 0; i < plotHeight; i++) { // row
                for (var j = 0; j < rowLength; j++) { // column
                    if (!plot[i][j].taken) {
                        if (isEnoughSpaceAndSun(i, j, width, height, plant.sun)) {
                            placePlant(i, j, width, height, plant);
                            return;
                        }
                    }
                }
            }
        }

        function isEnoughSpaceAndSun(row, col, plantWidth, plantHeight, sun) {
            var plantArea = plantWidth * plantHeight;
            var sunPreferenceMatch = 0;
            for (var i = row; i < row + plantHeight; i++) {
                for (var j = col; j < col + plantWidth; j++) {
                    if (!(i < plot.length && j < plot[0].length)) {
                        return false;
                    }
                    else if (plot[i][j].taken) {
                        return false;
                    }
                    else {
                        if (sun == plot[i][j].sun) {
                            sunPreferenceMatch++;
                        }
                    }
                }
            }
            if (sunPreferenceMatch / plantArea >= .5) {
                return true;
            }
            else {
                return false;
            }
        }

        function placePlant(row, col, plantWidth, plantHeight, plant) {
            for (var i = row; i < row + plantHeight; i++) {
                for (var j = col; j < col + plantWidth; j++) {
                    plot[i][j].taken = true;
                }
            }
            plot[row][col]["marker"] = plant.id;
        }

        function fillInExtraSpace() {
            var plant = plants[plants.length - 1];
            for (var i = 0; i < plot.length; i++) {
                for (var j = 0; j < plot[0].length; j++) {
                    if (isEnoughSpaceAndSun(i, j, plant.width, plant.height, plant.sun)) {
                        placePlant(i, j, plant.width, plant.height, plant);
                    }
                }
            }
        }
    };
    return returnObj;
}); 
