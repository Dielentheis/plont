describe('User Plots Factory', function () {

    beforeEach(module('FullstackGeneratedApp'));

    var UserPlotsFactory, $httpBackend;
    beforeEach(inject(function(_UserPlotsFactory_, _$httpBackend_) {
        UserPlotsFactory = _UserPlotsFactory_;
        $httpBackend = _$httpBackend_;
    }));

    it('it is an object', function () {
        expect(UserPlotsFactory).to.be.an('object');
    });

    describe('fetchUserPlots', function () {

        var userId;
        var responseData;

        beforeEach(function () {
            userId = 1;
            responseData = {name: 'MyPlot', layout: [[{}, {}], [{}, {}]]};

            $httpBackend
                .expectGET('/api/users/' + userId + '/plots')
                .respond(responseData);
            $httpBackend
                .expectGET('js/home/home.html')
                .respond(200);
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('makes a get request with a userId', function () {
            UserPlotsFactory.fetchUserPlots(1);
            $httpBackend.flush();
        });
        it('returns a promise that resolves to plot data', function (done) {
            UserPlotsFactory.fetchUserPlots(1)
            .then(function (data) {
                expect(data).to.be.deep.equal(responseData);
                done();
            })
            $httpBackend.flush();
        });
    });
});
