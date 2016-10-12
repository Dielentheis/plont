'use strict';
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var zipApiKey = process.env.ZIP_API || require('../../../../apis.js').zip;
var http = require('http');
var request = require('request-promise');

module.exports = function (app, db) {

    var User = db.model('user');

    // When passport.authenticate('local') is used, this function will receive
    // the email and password to run the actual authentication logic.
    var strategyFn = function (email, password, done) {
        User.findOne({
                where: {
                    email: email
                }
            })
            .then(function (user) {
                // user.correctPassword is a method from the User schema.
                if (!user || !user.correctPassword(password)) {
                    done(null, false);
                } else {
                    // Properly authenticated.
                    done(null, user);
                }
            })
            .catch(done);
    };

    passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'}, strategyFn));

    // A POST /login route is created to handle login.
    app.post('/login', function (req, res, next) {
        var authCb = function (err, user) {
            if (err) return next(err);
            if (!user) {
                var error = new Error('Invalid login credentials.');
                error.status = 401;
                return next(error);
            }

            // req.logIn will establish our session.
            req.logIn(user, function (loginErr) {
                if (loginErr) return next(loginErr);
                // We respond with a response object that has user with _id and email.
                res.status(200).send({
                    user: user.sanitize()
                });
            });

        };
        passport.authenticate('local', authCb)(req, res, next);
    });

    var findFrostDates = function(userObj, zip) {
        var findLatAndLongUrl = 'http://www.zipcodeapi.com/rest/' + zipApiKey + '/info.json/' + zip + '/degrees';

        return request(findLatAndLongUrl)
        .then(function(zipInfo) {
            zipInfo = JSON.parse(zipInfo);
            return request('http://farmsense-prod.apigee.net/v1/frostdates/stations/?lat=' + zipInfo["lat"] + '&lon=' + zipInfo["lng"])
        })
        .then(function(stations) {
            stations = JSON.parse(stations);
            var stationId = stations[0].id;
            return request('http://farmsense-prod.apigee.net/v1/frostdates/probabilities/?station=' + stationId + '&season=1')
        })
        .then(function(tempObjs) {
            tempObjs = JSON.parse(tempObjs);
            var springDate = tempObjs[1].prob_50;
            var month = parseInt(springDate.slice(0, 2));
            var day = parseInt(springDate.slice(-2));
            var dateDate = new Date(2017, month - 1, day);
            userObj.springFrostDate = dateDate;
            return userObj;
        })
        .catch(function(error) { console.log(error) });
    }

    app.post('/signup', function (req, res, next) {
        var userObj = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            zip: req.body.zip
        }

        userObj = findFrostDates(userObj, req.body.zip)
        .then(function(user) {
            User.create(user)
            .then(function(newUser){
                req.logIn(newUser, function (loginErr) {
                    if (loginErr) return next(loginErr);
                    // We respond with a response object that has user with _id and email.
                    res.status(200).send({
                        user: newUser.sanitize()
                    });
                });
            })
            .catch(next);
        });

    });

};
