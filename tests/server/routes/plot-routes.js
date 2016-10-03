'use strict'
// Instantiate all models
var expect = require('chai').expect;

var Sequelize = require('sequelize');

var db = require('../../../server/db');

var supertest = require('supertest');


describe('api/plots', function() {

    var app, Plot, guestAgent;

    beforeEach('Sync DB', function () {
        return db.sync({ force: true });
    });

    beforeEach('Create app', function () {
        app = require('../../../server/app')(db);
        Plot = db.model('plot');
    });

    describe('Plot requests', function () {

        var guestAgent;

        var plot = {
            height: 20,
            width: 20
        };

        beforeEach('Create a plot', function () {
            return Plot.create(plot);
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
              expect(res.body).to.have.length(1);
              done();
            });
        });

        it('GET by id', function (done) {
            guestAgent
            .get('/api/plots/' + plot.id)
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              expect(res.body).to.be.instanceof(Object);
              done();
            });
        });

        it('PUT by adding a plant', function (done) {
            guestAgent
            .get('/api/plots/3/plants/1')
            .expect(201)
            .end(function (err, res) {
              if (err) return done(err);
              expect(res.body).to.be.instanceof(Object);
            });
        });

        it('DELETE a plant from a plot', function (done) {
            guestAgent
            .get('/api/plots/3/plants/1')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              expect(res.body).to.be.instanceof(Object);
            });
        });

    });

});
