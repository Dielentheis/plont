'use strict'
// Instantiate all models
var expect = require('chai').expect;

var Sequelize = require('sequelize');

var db = require('../../../server/db');

var supertest = require('supertest');


describe('api/plots', function() {

    var app, Plot, Plant, PlotPlants, guestAgent;

    beforeEach('Create app', function () {
        app = require('../../../server/app')(db);
        Plot = db.model('plot');
        Plant = db.model('plant');
        PlotPlants = db.model('plot_plants')
    });

    describe('Plot requests', function () {

        var guestAgent;
        var plot1;
        var plant1;

        var plotInfo = {
            height: 20,
            width: 20
        };

        var plantInfo = {
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

        beforeEach('Create a plot', function () {
            return Plot.create(plotInfo)
            .then(function(plot){
                plot1 = plot;
            });
        });

        beforeEach('Create a plant', function () {
            return Plant.create(plantInfo)
            .then(function(plant){
                plant1 = plant;
            });
        });

        beforeEach('Create guest agent', function () {
            guestAgent = supertest.agent(app);
        });

        it('GET all', function (done) {
            guestAgent
            .get('/api/plots')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.be.instanceof(Array);
                done();
            });
        });

        it('GET by id', function (done) {
            guestAgent
            .get('/api/plots/' + plot1.id)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.be.instanceof(Object);
                done();
            });
        });

        it('POST userid to the plot', function (done) {
            guestAgent
            .post('/api/plots/')
            .send({height: 20, width:20})
            .expect(200)
            .end(function (err, res) {
                plot1.setUser(1)
                .then(function(plot){
                    expect(plot.userId).to.equal(1);
                    done();
                })
            });
        });

        it('PUT by adding a plant', function (done) {
            guestAgent
            .put('/api/plots/' + plot1.id + '/plants/' + plant1.id)
            .send(plantInfo)
            .expect(201)
            .end(function (err, res) {
                if (err) return done(err);
                PlotPlants.findAll({where: {plantId: plant1.id}})
                    .then(function(plant){
                        expect(plant).to.not.be.null;
                        done();
                })
                .catch(done);
            });
        });

        it('DELETE a plant from a plot', function (done) {
            guestAgent
            .delete('/api/plots/' + plot1.id + '/plants/' + plant1.id)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                PlotPlants.findAll({where: {plantId: plant1.id}})
                .then(function(plant){
                    expect(plant).to.be.instanceof(Array);
                    expect(plant).to.have.length(0);
                    done();
                })
                .catch(done);
            });
        });
    });
});
