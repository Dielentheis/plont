'use strict';
var crypto = require('crypto');
var _ = require('lodash');
var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('user', {
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    },
    zip: {
        type: Sequelize.STRING(5)
    },
    dry: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    wet: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    weather: {
        type: Sequelize.ARRAY(Sequelize.STRING)
    },
    password: {
        type: Sequelize.STRING
    },
    salt: {
        type: Sequelize.STRING
    },
    springFrostDate: {
        type: Sequelize.DATE
    },
    twitter_id: {
        type: Sequelize.STRING
    },
    facebook_id: {
        type: Sequelize.STRING
    },
    google_id: {
        type: Sequelize.STRING
    }
}, {
    instanceMethods: {
        sanitize: function () {
            return _.omit(this.toJSON(), ['password', 'salt']);
        },
        correctPassword: function (candidatePassword) {
            return this.Model.encryptPassword(candidatePassword, this.salt) === this.password;
        },
        incrementWet: function() {
            return this.wet++;
        },
        incrementDry: function() {
            return this.dry++;
        }
    },
    classMethods: {
        generateSalt: function () {
            return crypto.randomBytes(16).toString('base64');
        },
        encryptPassword: function (plainText, salt) {
            var hash = crypto.createHash('sha1');
            hash.update(plainText);
            hash.update(salt);
            return hash.digest('hex');
        }
    },
    getterMethods: {
        fullName: function () {
            return this.firstName + ' ' + this.lastName;
        }
    },
    hooks: {
        beforeCreate: function (user) {
            if (user.changed('password')) {
                user.salt = user.Model.generateSalt();
                user.password = user.Model.encryptPassword(user.password, user.salt);
            }
        },
        beforeUpdate: function (user) {
            if (user.changed('password')) {
                user.salt = user.Model.generateSalt();
                user.password = user.Model.encryptPassword(user.password, user.salt);
            }
        }
    }
});
