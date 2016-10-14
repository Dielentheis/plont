describe('Nav Factory', function () {

    beforeEach(module('FullstackGeneratedApp'));

    var NavFactory, $httpBackend;
    beforeEach(inject(function(_NavFactory_, _$httpBackend_) {
        NavFactory = _NavFactory_;
        $httpBackend = _$httpBackend_;
    }));

    it('is an object', function () {
        expect(NavFactory).to.be.an('object');
    });

    describe('getWeather', function () {

        var userId;
        var responseData;

        beforeEach(function () {
            userId = 1;
            responseData = {weather: 'sunny'};

            $httpBackend
                .expectGET('/api/weather/' + userId)
                .respond(responseData);
            $httpBackend
                .expectGET('js/home/home.html')
                .respond(200);
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('makes a get request by user id', function () {
            NavFactory.getWeather(1);
            $httpBackend.flush();
        });

        it('returns a promise that resolves to weather data', function (done) {
            NavFactory.getWeather(1)
            .then(function (data) {
                expect(data).to.be.deep.equal(responseData);
                done();
            })
            $httpBackend.flush();
        });
    });
});
