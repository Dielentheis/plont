app.config(function($stateProvider) {
    $stateProvider.state('sunmap', {
        url: '/sunmap',
        templateUrl: 'js/sunmap/sunmap.html',
        controller: 'SunController'
    });
});

app.controller('SunController', function($scope, CreatePlotFactory) {

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
        console.log("I toggled!!");
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
        const inchesBoard = [];
        $scope.board.forEach((row, index) => {
            inchesBoard.push([]);
            row.forEach(cellObject => {
                for (let i = 6; i > 0; --i) {
                    inchesBoard[inchesBoard.length - 1].push(cellObject); // pushes cellObject into current Row
                }
            });
            inchesBoard[index].slice(0, width);  // slice row to original length
            if (inchesBoard.length < 12) {
                for (let i = 5; i > 0; --i) {  // pushes 5 copies of the row
                    inchesBoard.push([...inchesBoard[index]]);
                }
            }
        });

        inchesBoard.length = height;
        console.log("The Final Table: ", inchesBoard);
        return inchesBoard;
    };
});
