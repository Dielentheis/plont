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

app.factory('PlotsFactory', function($http, $state, AuthService) {
    var returnObj = {};

    returnObj.makesThenStoresThenRedirects = function(plot, plants) {
        return AuthService.getLoggedInUser()
        .then(function(user) {
            plot = returnObj.makePlot(plot, plants);
            var importantDates = returnObj.findImportantDates(user.springFrostDate, plants);
            $http.post('/api/plots/', {height: plot.length, width: plot[0].length, layout: plot, important_dates: importantDates})
            .then(function(savedPlot) {
                $state.go('plot({id: savedPlot.id})');
            });
        })
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
                plant.numToPlant = numPlantsToPlant;
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
            plot[row][col].marker = plant.id;
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

    returnObj.findImportantDates = function(frostDate, plants) {
        var importantDates = [];
        // {event: xxx, date: xxx}

        plants.forEach(function(plant) {
            var plantEvent = {};
            plantEvent.event = "Plant the " + plant.name;
            plantEvent.date = plant.springFrostDate;
            if (plant.howFarBefore) {
                plantEvent.date.setTime(plantEvent.date.getTime() - plant.howFarBefore * 86400000);
            }
            else if (plant.howFarAfter) {
                plantEvent.date.setTime(plantEvent.date.getTime() + plant.howFarAfter * 86400000);
            }
            var harvestBeginEvent = {};
            harvestBeginEvent.event = "Begin " + plant.name.toLowercase() + " harvest";
            harvestBeginEvent.date = plantEvent.date;
            harvestBeginEvent.date.setTime(harvestBeginEvent.date.getTime() + plant.firstHarvest * 86400000);
            var harvestEndEvent = {};
            harvestEndEvent.event = "End " + plant.name.toLowercase() + " harvest";
            harvestEndEvent.date = harvestBeginEvent.date;
            harvestEndEvent.date = harvestEndEvent.date.setTime(harvestEndEvent.date.getTime() + plant.harvestPeriod * 86400000);
            importantDates.push(plantEvent, harvestBeginEvent, harvestEndEvent);
        });

        return importantDates;
    }
    return returnObj;
});
