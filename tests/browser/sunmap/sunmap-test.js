describe('Sun Controller', function () {

    beforeEach(module('FullstackGeneratedApp'));

    var $scope, SunController;
    beforeEach(inject(function($controller){
        $scope = {};
        SunController = $controller('SunController', {$scope: $scope});
    }));

    // describe('$scope.sunToggle', function () {

    //     var cell;
    //     beforeEach(function () {
    //         cell = {
    //             sunniness: 'sun',
    //             sun: 2
    //         }
    //     })

    //     it('toggles sunniness value from sun to partial shade', function () {
    //         $scope.sunToggle(cell.sunniness);
    //         expect($scope.area).to.be.equal(4);
    //     });

    // })

    // to test changesTheGridSizeBackFromHalfFeetToInches, make mock PlotService.makesThenStoresThenRedirects that just returns inchesBoard.
})
