describe('User Plant Controller', function () {

    beforeEach(module('FullstackGeneratedApp'));

    var $scope, UserPlantController, PlantFactory;
    beforeEach(inject(function($controller){
        $scope = {};
        PlantFactory = {};
        UserPlantController = $controller('UserPlantController', {$scope: $scope, PlantFactory: PlantFactory});
    }));

    describe('removePlant', function() {

        var userId, plantId, userPlantDb;
        beforeEach(function () {
            userId = 1;
            plantId = 1;
            userPlantDb = {1: [{id: 1, name: 'Basil'}, {id: 2, name: 'Carrot'}], 2: [{id: 1, name: 'Basil'}]}
            PlantFactory.removePlantFromUser = function (uId, pId) {
                var usersPlants = userPlantDb[uId];
                usersPlants.forEach(function (elem, index, array) {
                    if (elem.id === pId) {
                        array.splice(index, 1);
                    }
                })
                userPlantDb[uId] = usersPlants;
            };
            PlantFactory.fetchUserPlants = function (uId) {
                var userPlants = userPlantDb[uId];
                return userPlants;
            };
        });

        it('removes a plant from the users plant database', function () {
            $scope.removePlant(1, 1);
            expect(userPlantDb[1].length).to.be.equal(1);
        });
    });
});
