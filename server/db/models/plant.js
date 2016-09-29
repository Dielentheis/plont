'use strict'
var _ = require('lodash');
var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('plant', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    sun: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    bestGerminationTemp: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    notes: {
        type: Sequelize.TEXT
    },
    goodNeighbors: {
        type: Sequelize.ARRAY(Sequelize.STRING)
    },
    isPerennial: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    firstHarvest: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    harvestPeriod: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    afterFrost: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    howFarBefore: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    howFarAfter: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    width: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    height: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    watering: {
        type: Sequelize.STRING
    },
    feeding: {
        type: Sequelize.STRING
    },
    diseases: {
        type: Sequelize.STRING
    },
    pests: {
        type: Sequelize.ARRAY(Sequelize.STRING)
    },
    image: {
        type: Sequelize.STRING
    }
});
