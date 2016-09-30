var sinon = require('sinon');
var expect = require('chai').expect;

var Sequelize = require('sequelize');

var db = require('../../../server/db');

var Plant = db.model('plant');

describe('Plant model', function () {

    beforeEach('Sync DB', function () {
        return db.sync({ force: true });
    });

    describe('on creation', function () {
        it ('has all required fields', function() {
    	  return Plant.create({
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
    		})
    	    .then(function(product) {
        	    expect(product.name).to.exist;
        	    expect(product.description).to.exist;
        	    expect(product.isPerennial).to.exist;
        	    expect(product.firstHarvest).to.exist;
        	    expect(product.harvestPeriod).to.exist;
        	    expect(product.howFarBefore).to.exist;
        	    expect(product.howFarAfter).to.exist;
        	    expect(product.width).to.exist;
        	    expect(product.height).to.exist;
    		});
	    });

        it('will not allow a long title', function() {
            var invalidName = "This is not supposed to be a title it is supposed to be a description! This is not supposed to be a title it is supposed to be a description! This is not supposed to be a title it is supposed to be a description! This is not supposed to be a title it is supposed to be a description!";
            var plant = Plant.build({
                name: invalidName,
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
            });
            return plant.validate()
            .then(function(plant) {
                expect(plant).to.equal(null);
            });
        });

        it('has a grow time and harvest period of greater than zero', function() {
            return Plant.create({
                name: "Rose",
                description: "A plant",
                sun: 2,
                isPerennial: false,
                firstHarvest: 50,
                harvestPeriod: 5,
                afterFrost: true,
                howFarBefore: 0,
                howFarAfter: 14,
                width: 10,
                height: 20
            })
            .then(function(plant){
                expect(plant.firstHarvest).to.be.above(0);
                expect(plant.harvestPeriod).to.be.above(0);
            });
        });

        it('can handle a long description or note', function() {
            var longTextBlock = "This is a longer block of text! This is a longer block of text! This is a longer block of text! This is a longer block of text! This is a longer block of text! This is a longer block of text! This is a longer block of text! This is a longer block of text! This is a longer block of text! This is a longer block of text! This is a longer block of text!";
            return Plant.create({
                name: "Orchid",
                description: longTextBlock,
                sun: 2,
                notes: longTextBlock,
                isPerennial: false,
                firstHarvest: 50,
                harvestPeriod: 10,
                afterFrost: true,
                howFarBefore: 0,
                howFarAfter: 14,
                width: 10,
                height: 20
            })
            .then(function(orchid) {
                expect(orchid.description).to.equal(longTextBlock);
                expect(orchid.notes).to.equal(longTextBlock);
            });
        });

        it('expects neighbors and pests to be arrays', function() {
            var neighbors = ["strawbs", "corn"];
            var pests = ["aphids"];
            return Plant.create({
                name: "onion",
                description: "a simple plant",
                sun: 2,
                goodNeighbors: neighbors,
                isPerennial: false,
                firstHarvest: 50,
                harvestPeriod: 10,
                afterFrost: true,
                howFarBefore: 0,
                howFarAfter: 14,
                width: 10,
                height: 20,
                pests: pests
            })
            .then(function(plant) {
                expect(plant.goodNeighbors).to.be.an.instanceof(Array);
                expect(plant.pests).to.be.an.instanceof(Array);
            });
        });
    });
});
