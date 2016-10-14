describe('Plant Factory', function () {

    beforeEach(module('Plont'));

    var PlantFactory, $httpBackend;
    beforeEach(inject(function(_PlantFactory_, _$httpBackend_) {
        PlantFactory = _PlantFactory_;
        $httpBackend = _$httpBackend_;
    }));

    it('is an object', function () {
        expect(PlantFactory).to.be.an('object');
    });

    describe('fetchOne', function () {

        var plantId;
        var responseData;

        beforeEach(function () {
            plantId = 1;
            responseData = {name: 'Basil'};

            $httpBackend
                .expectGET('/api/plants/' + plantId)
                .respond(responseData);
            $httpBackend
                .expectGET('js/home/home.html')
                .respond(200);
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('makes a get request by plant id', function () {
            PlantFactory.fetchOne(1);
            $httpBackend.flush();
        });

        it('returns a promise that resolves to plant data', function (done) {
            PlantFactory.fetchOne(1)
            .then(function (data) {
                expect(data).to.be.deep.equal(responseData);
                done();
            })
            $httpBackend.flush();
        });
    });

    describe('addToUser', function () {

        var userId,
            plants,
            responseData;

        beforeEach(function () {
            userId = 1;
            plants = [1, 2, 3]
            responseData = 200;

            $httpBackend
                .expectPUT('api/plants/' + userId, plants)
                .respond(responseData);
            $httpBackend
                .expectGET('js/home/home.html')
                .respond(200);
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('makes a put request with user id and an array of plant ids', function () {
            PlantFactory.addToUser(1, [1, 2, 3]);
            $httpBackend.flush();
        });
    });

    describe('fetchUserPlants', function () {

        var userId,
            responseData;

        beforeEach(function () {
            userId = 1;
            responseData = [{name: 'Basil'}, {name: 'Carrot'}];

            $httpBackend
                .expectGET('api/plants/user/' + userId)
                .respond(responseData);
            $httpBackend
                .expectGET('js/home/home.html')
                .respond(200);
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('makes a get request with user id for that user\'s plants', function () {
            PlantFactory.fetchUserPlants(1);
            $httpBackend.flush();
        });

        it('returns a promise that resolves to plant data', function (done) {
            PlantFactory.fetchUserPlants(1)
            .then(function (data) {
                expect(data).to.be.deep.equal(responseData);
                done();
            })
            $httpBackend.flush();
        });
    });

    describe('removePlantFromUser', function () {

        var userId,
            plantId,
            responseData;

        beforeEach(function () {
            userId = 1;
            plantId = 3;

            $httpBackend
                .expectDELETE('api/plants/user/' + userId + '/plant/' + plantId)
                .respond(204);
            $httpBackend
                .expectGET('js/home/home.html')
                .respond(200);
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('makes a delete request with the user\'s id and the id of the plant to be deleted', function () {
            PlantFactory.removePlantFromUser(userId, plantId);
            $httpBackend.flush();
        });

    });
});
