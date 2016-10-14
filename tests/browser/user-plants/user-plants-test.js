describe('User Plant Controller', function () {

    beforeEach(module('Plont'));

    var $scope, UserPlantController, PlantFactory;
    beforeEach(inject(function($controller){
        $scope = {};
        PlantFactory = {};
        UserPlantController = $controller('UserPlantController', {$scope: $scope, PlantFactory: PlantFactory});
    }));

    describe('removePlant', function() {

        var userId, plantId, userPlantDb, deferred;
        beforeEach(inject(function ($q) {
            userId = 1;
            plantId = 1;
            deferred = $q.defer();
            userPlantDb = {1: [{id: 1, name: 'Basil'}, {id: 2, name: 'Carrot'}], 2: [{id: 1, name: 'Basil'}]}
            PlantFactory.removePlantFromUser = function (uId, pId) {
                var usersPlants = userPlantDb[uId];
                usersPlants.forEach(function (elem, index, array) {
                    if (elem.id === pId) {
                        array.splice(index, 1);
                    }
                })
                userPlantDb[uId] = usersPlants;
                deferred.resolve();
                return deferred.promise;
            };
            PlantFactory.fetchUserPlants = function (uId) {
                var userPlants = userPlantDb[uId];
                deferred.resolve(userPlants);
                return deferred.promise;
            };
        }));

        it('removes a plant from the users plant database', function () {
            $scope.removePlant(1, 1);
            expect(userPlantDb[1].length).to.be.equal(1);
        });

        it('only removes the given plant from the given user', function () {
            $scope.removePlant(1, 1);
            expect(userPlantDb[1].length).to.be.equal(1);
            expect(userPlantDb[2][0].id).to.be.equal(1);
        })
    });
});
