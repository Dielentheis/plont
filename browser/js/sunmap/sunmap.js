app.config(function($stateProvider) {
    $stateProvider.state('sunmap', {
        url: '/sunmap',
        templateUrl: 'js/sunmap/sunmap.html',
        controller: 'SunController'
    });
});

app.controller('SunController', function($scope, CreatePlotFactory, PlotService) {

    const height = CreatePlotFactory.height,
        width = CreatePlotFactory.width,

        halfFeetHeight = Math.ceil(height / 6),
        halfFeetWidth = Math.ceil(width / 6),

        shadeDict = {
            sun: 2,
            partial_shade: 1,
            full_shade: 0
        };

    $scope.board = CreatePlotFactory.createPlot(halfFeetHeight, halfFeetWidth);

    $scope.sunToggle = function(sunniness) {
        switch (sunniness) {
            case 'sun':
                this.cells.sunniness = 'partial_shade';
                break;
            case 'partial_shade':
                this.cells.sunniness = 'full_shade';
                break;
            case 'full_shade':
                this.cells.sunniness = 'sun';
                break;
        }
        this.cells.sun = shadeDict[this.cells.sunniness];
    };

    $scope.changesTheGridSizeBackFromHalfFeetToInches = function() {
        const inchesBoard = mag($scope.board, 6);
        // const inchesBoard = [];
        // $scope.board.forEach((row, index) => {
        //     inchesBoard.push([]);
        //     row.forEach(cellObject => {
        //         for (let i = 6; i > 0; --i) {
        //             inchesBoard[inchesBoard.length - 1].push(cellObject); // pushes cellObject into current Row
        //         }
        //     });
        //     inchesBoard[index].slice(0, width);  // slice row to original length
        //     if (inchesBoard.length < 12) {
        //         for (let i = 5; i > 0; --i) {  // pushes 5 copies of the row
        //             inchesBoard.push([...inchesBoard[index]]);
        //         }
        //     }
        // });
        function mag(arr, scale) {
            var res = [];
            if(!arr.length)
                return arr;
            for (var i = 0; i < arr.length; i++) {
                var temp = mag(arr[i], scale);
                for (var k = 0; k < scale; k++) {
                    res.push(temp.slice ? temp.slice(0) : temp);
                }
            }
            return res;
        }

        console.log("inchesboard", inchesBoard[0][0]);
        PlotService.makesThenStoresThenRedirects(inchesBoard, CreatePlotFactory.usersPlants);
    };
});
