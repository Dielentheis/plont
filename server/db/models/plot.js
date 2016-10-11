'use strict'
var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('plot', {
    name: {
        type: Sequelize.TEXT
    },
    width: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            max: 240,
            min: 12,
        }
    },
    height: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            max: 240,
            min: 12,
        }
    },
    layout: {
        type: Sequelize.JSON
    },
    important_dates: {
        type: Sequelize.ARRAY(Sequelize.JSON)
    }
});
