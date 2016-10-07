'use strict'
var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('plot', {
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
        type: Sequelize.ARRAY(Sequelize.ARRAY(Sequelize.JSON))
    }
});
