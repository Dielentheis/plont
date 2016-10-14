describe('Create Plot Factory', function () {

    beforeEach(module('FullstackGeneratedApp'));

    var CreatePlotFactory;
    beforeEach(inject(function(_CreatePlotFactory_) {
        CreatePlotFactory = _CreatePlotFactory_;
    }));

    it('is an object', function () {
        expect(CreatePlotFactory).to.be.an('object');
    });

    describe('Cell function', function () {
        it('creates Cell objects', function () {
            var cell = new CreatePlotFactory.Cell();
            expect(cell).to.be.an('object');
            expect( cell.sun ).to.be.equal(2);
            expect( cell.sunniness ).to.be.equal('sun');
            expect( cell.taken ).to.be.equal(false);
        });
    });

    describe('createPlot function', function () {
        it('creates plot data instances', function () {
            var plot = CreatePlotFactory.createPlot(2, 2);
            expect( plot.length ).to.be.equal(2);
            expect( plot[0].length ).to.be.equal(2);
        });
        it('includes new Cell objects', function () {
            var plot = CreatePlotFactory.createPlot(2, 2);
            expect( plot[0][0].sun ).to.be.equal(2);
        });
    });

    describe('setHeightAndWidth function', function () {
        it('sets height and width as properties on the object', function () {
            CreatePlotFactory.setHeightAndWidth(4, 6);
            expect(CreatePlotFactory.height).to.be.equal(4);
            expect(CreatePlotFactory.width).to.be.equal(6);
        });
    });

    describe('userPlantList function', function () {
        it('sets an array of users plants on the object', function () {
            var plants = [{name: 'basil'}, {name: 'tomato'}];
            CreatePlotFactory.userPlantList(plants);
            expect(CreatePlotFactory.usersPlants.length).to.be.equal(2);
            expect(CreatePlotFactory.usersPlants[0].name).to.be.equal('basil');
        });
    });

    describe('setPlotName function', function () {
        it('sets a given plot name on the object', function () {
            CreatePlotFactory.setPlotName('Plot Name');
            expect(CreatePlotFactory.plotName).to.be.equal('Plot Name');
        });
        it('when a name is not given, it sets a default', function () {
            CreatePlotFactory.setPlotName();
            expect(CreatePlotFactory.plotName).to.be.equal('Unnamed Plot');
        });
    });
})
describe('Create Controller', function () {

    beforeEach(module('FullstackGeneratedApp'));

    var $scope, CreateCtrl;
    beforeEach(inject(function($controller){
        $scope = {};
        PlantsFactory = {};
        CreateCtrl = $controller('CreateCtrl', {$scope: $scope});
    }));

    describe('createPlot', function () {
        it('sets $scope.area', function () {
            $scope.area = null;
            $scope.createPlot(2, 2, 'Plot');
            expect($scope.area).to.be.equal(4);
        });
        it('sets $scope.switch from false to true', function () {
            $scope.switch = false;
            $scope.createPlot(2, 2, 'Plot');
            expect($scope.switch).to.be.equal(true);
        })
    })


})
