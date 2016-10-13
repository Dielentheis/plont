app.config(function($stateProvider) {
    $stateProvider.state('calendar', {
        url: '/calendar',
        templateUrl: 'js/calendar/calendar.html',
        controller: 'CalendarCtrl'
    });
});

app.factory('CalendarFactory', function($http, AuthService){
    var CalendarFactory = {};

    // get user
    CalendarFactory.getImportantDates = function(userId) {
        return $http.get('/api/plots/users/'+ userId)
        .then(function(userPlots){
            return userPlots.data;
        });
    };
    return CalendarFactory;
});

app.controller('CalendarCtrl', function($scope, $filter, $http, CalendarFactory, $log, $q, $timeout, AuthService, MaterialCalendarData) {

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
    $scope.importantDates = [];

    AuthService.getLoggedInUser()
    .then(function(user){
        CalendarFactory.getImportantDates(user.id)
            .then(function(userPlots){
                userPlots.forEach(function(eventObj){
                    $scope.importantDates.push(eventObj.important_dates);
                    $scope.setDates($scope.importantDates);
            });
        });
    });

    $scope.setDates = function(dates) {

        dates.forEach(function(dateArr){
            for (var i=0; i<dateArr.length; i++) {

                var formattedDate = new Date(dateArr[i].date);
                var formattedText = "<p>" + dateArr[i].event + "</p>";

                MaterialCalendarData.setDayContent(formattedDate, formattedText);

            }

        });
    };

});
