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

    describe('sortByName', function () {

        var dataArr, inputOne, inputTwo;
        beforeEach(function () {
            dataArr = [{name: 'Watermelon'}, {name: 'Carrot'}, {name: 'Onion'}]
            inputOne = {name: 'Basil'};
            inputTwo = {name: 'Tomato'};
        });

        it('returns -1 if the first parameter comes alphabetically before the second', function () {
            let result = PlantsFactory.sortByName(inputOne, inputTwo);
            expect(result).to.be.equal(-1);
        });

        it('returns 1 if the second parameter comes alphabetically before the first', function () {
            let result = PlantsFactory.sortByName(inputTwo, inputOne);
            expect(result).to.be.equal(1);
        });

        it('can sort an array of objects by name property when used with .sort()', function () {
            let result = dataArr.sort(PlantsFactory.sortByName);
            expect(result[0].name).to.be.equal('Carrot');
            expect(result[2].name).to.be.equal('Watermelon');
        });
    });
});
