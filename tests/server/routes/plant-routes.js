'use strict'
// Instantiate all models
var expect = require('chai').expect;

var Sequelize = require('sequelize');

var db = require('../../../server/db');

var supertest = require('supertest');


describe('api/plants', function() {

    var app, Plant, guestAgent;

    beforeEach('Sync DB', function () {
        return db.sync({ force: true });
    });

    beforeEach('Create app', function () {
        app = require('../../../server/app')(db);
        Plant = db.model('plant');
    });

    describe('Plant requests', function () {

        var guestAgent;

        var plant = {
            name: "Rose",
            description: "A plant",
            sun: 2,
            isPerennial: false,
            firstHarvest: 50,
            harvestPeriod: 10,
            afterFrost: true,
            howFarBefore: 0,
            howFarAfter: 14,
            width: 10,
            height: 20
        };

        beforeEach('Create a plant', function () {
            return Plant.create(plant);
        });

        beforeEach('Create guest agent', function () {
            guestAgent = supertest.agent(app);
        });

        it('GET all', function (done) {
            guestAgent
            .get('/api/plants')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              expect(res.body).to.be.instanceof(Array);
              expect(res.body).to.have.length(1);
              done();
            });
        });
    });
});
