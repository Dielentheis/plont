app.config(function($stateProvider) {
    $stateProvider.state('calendar', {
        url: '/calendar',
        templateUrl: 'js/calendar/calendar.html',
        controller: 'CalendarCtrl'
    });
});

app.factory('CalendarFactory', function($http, AuthService, PlotsFactory){
    var CalendarFactory = {};

    // get user
    CalendarFactory.getImportantDates = function() {
        AuthService.getLoggedInUser()
        .then(function(user){
            var userId = user.id;
            $http.get('/api/plots/'+ userId)
            .then(function(userPlots){
                return userPlots;
            })
        })
    };
    // for each array of plants, pass into setDayContent
    return CalendarFactory;
})

app.controller('CalendarCtrl', function($scope, $filter, $http,CalendarFactory, $log, MaterialCalendarData, $q, $timeout) {

    $scope.selectedDate = new Date();
    $scope.weekStartsOn = 0;
    $scope.dayFormat = "d";
    $scope.tooltips = true;
    $scope.disableFutureDates = false;


    $scope.setDirection = function(direction) {
        $scope.direction = direction;
        $scope.dayFormat = direction === "vertical" ? "EEEE, MMMM d" : "d";
    };

    $scope.dayClick = function(date) {
        $scope.msg = "You clicked " + $filter("date")(date, "MMM d, y h:mm:ss a Z");
    };

    $scope.prevMonth = function(data) {
        $scope.msg = "You clicked (prev) month " + data.month + ", " + data.year;
    };

    $scope.nextMonth = function(data) {
        $scope.msg = "You clicked (next) month " + data.month + ", " + data.year;
    };

    $scope.tooltips = true;

    var loadContentAsync = true;

    $log.info("setDayContent.async", loadContentAsync);

    var importantDates = [{event: 'Happy', date: new Date().toISOString()}];

    $scope.setDayContent = function(date) {
        var key = [date.toISOString()];
        var data = (importantDates[key] || [{
            event: ""
        }])[0].event;
        if (loadContentAsync) {
            var deferred = $q.defer();
            $timeout(function() {
                deferred.resolve(data);
            });
            return deferred.promise;
        }
        return data;
    };

    $scope.setDayContent(new Date());

});
