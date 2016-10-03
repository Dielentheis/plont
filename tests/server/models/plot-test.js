var sinon = require('sinon');
var expect = require('chai').expect;

var Sequelize = require('sequelize');

var db = require('../../../server/db');

var Plot = db.model('plot');

describe('Plot model', function () {

    beforeEach('Sync DB', function () {
        return db.sync({ force: true });
    });

    describe('on creation', function () {
        it ('has all required fields', function() {
            return Plot.create({
                width: 20,
                height: 20
            })
            .then(function(plot) {
                expect(plot.height).to.exist;
                expect(plot.width).to.exist;
            });
        });

        it ('has a height and width greater than or equal to 12', function() {
            var size = 5;
            var plot = Plot.build({
                width: size,
                height: size
            })
            return plot.validate()
            .then(function(plot) {
                expect(plot).to.equal(null);
            });
        });

        it ('can handle large plots', function() {
            var size = 200;
            Plot.create({
                width: size,
                height: size
            })
            .then(function(plot) {
                expect(plot.height).to.equal(200);
                expect(plot.width).to.equal(200);
            });
        });

    });
});
