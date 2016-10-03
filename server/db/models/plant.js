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
        type: Sequelize.INTEGER
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
        type: Sequelize.TEXT
    },
    feeding: {
        type: Sequelize.TEXT
    },
    diseases: {
        type: Sequelize.TEXT
    },
    pests: {
        type: Sequelize.ARRAY(Sequelize.STRING)
    },
    image: {
        type: Sequelize.TEXT
    }
},
{
    classMethods: {
        getSunPlants: function() {
            return this.findAll({
                where: {
                    sun: 2
                }
            })
        },
        getShadePlants: function() {
            return this.findAll({
                where: {
                    sun: 0
                }
            })
        },
        getPartShadePlants: function() {
            return this.findAll({
                where: {
                    sun: 1
                }
            })
        }
    }
});
