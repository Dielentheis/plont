app.factory('NavFactory', function ($http, $log, $mdDialog) {
    var NavFactory = {};

    NavFactory.getWeather = function(id) {
        return $http.get('/api/weather/' + id)
            .then(function(weather) {
                return weather.data;
            })
        .catch($log.error);
    };

    return NavFactory;
});

