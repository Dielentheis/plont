describe('Plants Factory', function () {

    beforeEach(module('FullstackGeneratedApp'));

    var PlantsFactory, $httpBackend;
    beforeEach(inject(function(_PlantsFactory_, _$httpBackend_) {
        PlantsFactory = _PlantsFactory_;
        $httpBackend = _$httpBackend_;
    }));

    it('is an object', function () {
        expect(PlantsFactory).to.be.an('object');
    });

    describe('fetchAll', function () {

        var responseData;

        beforeEach(function () {
            responseData = [{name: 'Basil'}, {name: 'Carrot'}, {name: 'Sage'}];

            $httpBackend
                .expectGET('/api/plants/')
                .respond(responseData);
            $httpBackend
                .expectGET('js/home/home.html')
                .respond(200);
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('makes a get request', function () {
            PlantsFactory.fetchAll();
            $httpBackend.flush();
        });

        it('returns a promise that resolves to plant data', function (done) {
            PlantsFactory.fetchAll()
            .then(function (data) {
                expect(data).to.be.deep.equal(responseData);
                done();
            })
            $httpBackend.flush();
        });
    });
});
