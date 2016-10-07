var router = require('express').Router(); // eslint-disable-line new-cap
var db = require('../../../db/_db.js');
var User = db.model('user');
var cron = require('node-cron');

module.exports = router;

var weatherApiKey = require('../../../../apis.js').weather;
var simpleWeather = require("simple-weather")({
    apiKey: weatherApiKey,
    units: "imperial",
    debug: process.env.NODE_ENV === 'development'
});

cron.schedule('0 22 * * *', function(){
  //console.log('running a task once a day at 10pm');
  findWeather();
});

//get weather for all users and track, count hot days in a row if greater than a number >> alert && reset count
//get weather for all users and track, count rainy days in a row if greater than a number >> alert && reset count

var findWeather = function() {
    User.find({where: {id: req.user.id}})
    .then(function(){

    })
    simpleWeather["v2.5"].current.byCityName("London", "uk")
        .then(function(response) {
            console.log("Current Weather of London, UK is");
            console.log("Temperature:", response.main.temp, "Farenheit");
        }).catch(function(err) {
        console.error(err.stack);
    });
};


