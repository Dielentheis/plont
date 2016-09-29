ar sinon = require('sinon');
var expect = require('chai').expect;

var Sequelize = require('sequelize');

var db = require('../../../server/db');

var Plant = db.model('Plant');

describe('User model', function () {

    beforeEach('Sync DB', function () {
       return db.sync({ force: true });
    });

});
