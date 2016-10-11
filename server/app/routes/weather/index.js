var router = require('express').Router(); // eslint-disable-line
var db = require('../../../db/_db.js');
var User = db.model('user');
var cron = require('node-cron');

var weatherApiKey = process.env.WEATHER_API || require('../../../../apis.js').weather;
var simpleWeather = require("simple-weather")({
    apiKey: weatherApiKey,
    units: "imperial",
    debug: process.env.NODE_ENV === 'development'
});

// cron schedule to check the weather in each users location each day at 5:30AM
var scheduler = cron.schedule('30 5 * * *', function(){
  console.log('running a task once a day at 5AM');
  findWeather();
});

// get weather for all users
// count hot days / rainy days in a row
// if greater than a decided upon number >> alert && reset count
var findWeather = function() {
    console.log('hereeee')
    User.findAll({where: {
        zip: {$ne: null}}
    })
    .then(function(users){
        users.forEach(function(user) {
            simpleWeather["v2.5"].current.byZipcode(user.zip)
            .then(function(response) {
                user.update({weather: [response.weather[0].main, response.main.temp]});
                console.log(response)
                if (response.rain) {
                    user.increment('wet');
                    user.update({dry: 0});
                }
                if (!response.rain) {
                    user.increment('dry');
                    user.update({wet:0});
                }
            })
            .catch(function(err) {
                console.error(err.stack);
            });
        });
    });
};

// starts with api/weather
router.get('/:id', function(req, res, next){
    User.findById(req.params.id)
    .then(function(user){
        res.send({
            wet: user.wet,
            dry: user.dry,
            weather: user.weather
        });
    });
});

module.exports = router;
