app.service('PlotService', function($http, AuthService, $log, $q, $state, CreatePlotFactory) {
    var classes = ["class1", "class2", "class3", "class4", "class5", "class6", "class7", "class8", "class9", "class10"];

    function associatePlants(plot, plants) {
        var promises = [];
        plants.forEach(function(plant) {
            promises.push($http.put('/api/plots/' + plot.id + '/plants/' + plant.id));
        });
        return $q.all(promises)
        .catch($log.error);
    }

    this.makesThenStoresThenRedirects = function(plot, plants) {
        var userForId = {};
        AuthService.getLoggedInUser()
        .then(function(user) {
            plot = makePlot(plot, plants);
            userForId = user;
            return findImportantDates(user.springFrostDate, plants)
        })
        .then(function(dates) {
            console.log("DATES", dates);
            var importantDates = dates;
            return $http.post('/api/plots/', {height: plot.length, width: plot[0].length, layout: plot, important_dates: importantDates, userId: userForId.id, name: CreatePlotFactory.plotName})
        })
        .then(function(savedPlot) {
            console.log("savedplot", savedPlot);
            associatePlants(savedPlot.data, plants)
            .then(function() {
                $state.go('plot', {id: savedPlot.data.id});
            })
        })
        .catch($log.error);
    };

    function makePlot(plot, plants) {
        var colorKeys = {};
        var plotArea = plot.length * plot[0].length;
        var numPlants = plants.length;
        var approxPlantArea = plotArea / numPlants;

        plants = assignNumPlantsToPlant(approxPlantArea, plants);
        console.log("assigned nums", plants, approxPlantArea);
        assignColorKeys(plants);
        plants.sort(orderByBiggest);
        plants.forEach(function(plant) {
            for (var i = 0; i < plant.numToPlant; i++) {
                console.log("planting", i, plant.name);
                console.log("plot");
                findSpaceAndPlant(plant);
            }
        });
        console.log("gonna call fillIn");
        fillInExtraSpace(plants);
        addCellClass();

        return plot;

        function assignColorKeys() {
            for (var i = 0; i < plants.length; i++) {
                colorKeys[plants[i].id] = classes[i];
            }
        }

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
                        if (isEnoughSpaceAndSun(i, j, plant)) {
                            placePlant(i, j, plant);
                            return;
                        }
                    }
                }
            }
        }

        function isEnoughSpaceAndSun(row, col, plant) {
            var plantArea = plant.width * plant.height;
            var sunPreferenceMatch = 0;
            for (var i = row; i < row + plant.height; i++) {
                for (var j = col; j < col + plant.width; j++) {
                    if (!(i < plot.length && j < plot[0].length)) {
                        return false;
                    }
                    else if (plot[i][j].taken) {
                        return false;
                    }
                    else {
                        if (plant.sun == plot[i][j].sun) {
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

        function placePlant(row, col, plant) {
            console.log("placing", plant.name, "at corner", row, col);
            for (var i = row; i < row + plant.height; i++) {
                for (var j = col; j < col + plant.width; j++) {
                    plot[i][j].taken = true;
                    plot[i][j].plantId = plant.id;
                }
            }
        }

        function fillInExtraSpace(plants) {
            console.log("supopsed to fill in")
            var plant = plants[plants.length - 1];
            console.log("plant", plant);
            for (var i = 0; i < plot.length; i++) {
                for (var j = 0; j < plot[0].length; j++) {
                    console.log("checking if space and sun");
                    if (isEnoughSpaceAndSun(i, j, plant)) {
                        console.log("planing");
                        placePlant(i, j, plant);
                    }
                }
            }
        }

        function addCellClass() {
            for (var i = 0; i < plot.length; i++) {
                for (var j = 0; j < plot[0].length; j++) {
                    if (plot[i][j].taken == false) {
                        plot[i][j].class = "no-plant";
                    }
                    plot[i][j].class = colorKeys[plot[i][j].plantId];
                }
            }
        }
    }

    function findImportantDates(frostDate, plants) {
        var importantDates = [];

        return AuthService.getLoggedInUser()
        .then(function(user) {
            plants.forEach(function(plant) {
                var plantEvent = {};
                plantEvent.event = "Plant the " + plant.name;
                plantEvent.date = new Date(user.springFrostDate);
                if (plant.howFarBefore) {
                    plantEvent.date.setTime(plantEvent.date.getTime() - plant.howFarBefore * 86400000);
                }
                else if (plant.howFarAfter) {
                    plantEvent.date.setTime(plantEvent.date.getTime() + plant.howFarAfter * 86400000);
                }
                importantDates.push(plantEvent);
                var harvestBeginEvent = {};
                harvestBeginEvent.event = "Begin " + plant.name.toLowerCase() + " harvest";
                harvestBeginEvent.date = _.clone(plantEvent.date);
                harvestBeginEvent.date.setTime(harvestBeginEvent.date.getTime() + plant.firstHarvest * 86400000);
                importantDates.push(harvestBeginEvent);
                var harvestEndEvent = {};
                harvestEndEvent.event = "End " + plant.name.toLowerCase() + " harvest";
                harvestEndEvent.date = _.clone(harvestBeginEvent.date);
                harvestEndEvent.date = harvestEndEvent.date.setTime(harvestEndEvent.date.getTime() + plant.harvestPeriod * 86400000);
                importantDates.push(harvestEndEvent);
            });
            return importantDates;
        });
    }
});
