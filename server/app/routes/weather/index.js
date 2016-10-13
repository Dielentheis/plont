var router = require('express').Router(); // eslint-disable-line
var db = require('../../../db/_db.js');
var User = db.model('user');
var cron = require('node-cron');
var weatherApiKey = process.env.WEATHER_API || require('../../../../apis.js').weather;
var TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || require('../../../../apis.js').twilioSID;
var TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || require('../../../../apis.js').twilioAuthToken;


var client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);


var simpleWeather = require("simple-weather")({
    apiKey: weatherApiKey,
    units: "imperial",
    debug: process.env.NODE_ENV === 'development'
});

// cron schedule to check the weather in each users location each day at 5:30AM
cron.schedule('*/2 * * * *', function(){
  findWeather();
});

// cron schedule to send text if user needs to water / not water each day at 10AM
cron.schedule('*/1 * * * *', function(){
  textUser();
});

// get weather for all users
// count hot days / rainy days in a row
// if greater than a decided upon number >> alert && reset count
var findWeather = function() {
    User.findAll({where: {
        zip: {$ne: null}}
    })
    .then(function(users){
        users.forEach(function(user) {
            simpleWeather["v2.5"].current.byZipcode(user.zip)
            .then(function(response) {
                user.update({weather: [response.weather[0].main, response.main.temp]});
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


var textUser = function() {
    var weatherAlert, weather;
    User.findAll({where: {
        zip: {$ne: null},
        phoneNumber: {$ne: null}}
    })
    .then(function(users){
        users.forEach(function(user) {
            if(user.wet > 5){
                weatherAlert = "You might want to skip out on watering your plants over the next few days. Nature is taking care of it! ";
                weather = "The forecast for today is " + Math.floor(user.weather[1]) + " degrees and " + user.weather[0].toLowerCase()+ ".";
            } else if (user.dry>5) {
                weatherAlert = "You may want to get outside and water your plants! It is dry out there. ";
                weather = "The forecast for today is " + Math.floor(user.weather[1]) + " degrees and " + user.weather[0].toLowerCase()+ ".";
            }
            client.sendMessage({

                to: user.phoneNumber, // Any number Twilio can deliver to
                from: '+12027590518', // A number you bought from Twilio and can use for outbound communication
                body: weatherAlert + weather // body of the SMS message

            }, function(err, responseData) { //this function is executed when a response is received from Twilio

                if (!err) { // "err" is an error received during the request, if any

                    console.log(responseData.from); // outputs "+14506667788"
                    console.log(responseData.body); // outputs "word to your mother."

                }
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
    })
    .catch(next);
});

module.exports = router;
