describe('Sun Controller', function () {

    beforeEach(module('Plont'));

    var $scope, SunController;
    beforeEach(inject(function($controller){
        $scope = {};
        SunController = $controller('SunController', {$scope: $scope});
    }));

    describe('$scope.sunToggle', function () {

        var sunCell;
        beforeEach(function () {
            sunCell = {
                cells : {
                    sunniness: 'sun',
                    sun: 2
                }
            }
        });

        it('toggles sunniness value from sun to partial shade', function () {
            $scope.sunToggle.call(sunCell, 'sun');
            expect(sunCell.cells.sunniness).to.be.equal('partial_shade');
            expect(sunCell.cells.sun).to.be.equal(1);
        });
        it('toggles sunniness value from partial shade to full shade', function () {
            $scope.sunToggle.call(sunCell, 'partial_shade');
            expect(sunCell.cells.sunniness).to.be.equal('full_shade');
            expect(sunCell.cells.sun).to.be.equal(0);
        });
        it('toggles sunniness value from full shade to sun', function () {
            $scope.sunToggle.call(sunCell, 'full_shade');
            expect(sunCell.cells.sunniness).to.be.equal('sun');
            expect(sunCell.cells.sun).to.be.equal(2);
        });

    });

    describe('changesTheGridSizeBackFromHalfFeetToInches', function () {

        var PlotService = {};
        beforeEach(inject(function ($controller) {
            PlotService.makesThenStoresThenRedirects = function (board) {
                $scope.inchesBoard = board;
            };
            SunController = $controller('SunController', {$scope: $scope, PlotService: PlotService});
        }));

        it('increases the dimensions of the board from half feet to inches', function () {
            $scope.board = [[{}, {}], [{}, {}]];
            $scope.changesTheGridSizeBackFromHalfFeetToInches();
            expect($scope.inchesBoard.length).to.be.equal(12);
            expect($scope.inchesBoard[0].length).to.be.equal(12);
        });

        it('can take variable board sizes', function () {
            $scope.board = [[{}, {}, {}], [{}, {}, {}], [{}, {}, {}]];
            $scope.changesTheGridSizeBackFromHalfFeetToInches();
            expect($scope.inchesBoard.length).to.be.equal(18);
            expect($scope.inchesBoard[0].length).to.be.equal(18);
            $scope.board = [[{}, {}], [{}, {}], [{}, {}], [{}, {}]];
            $scope.changesTheGridSizeBackFromHalfFeetToInches();
            expect($scope.inchesBoard.length).to.be.equal(24);
            expect($scope.inchesBoard[0].length).to.be.equal(12);
        });
    });
});
