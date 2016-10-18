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
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    zip: {
        type: Sequelize.STRING(5),
        allowNull: false
    },
    phoneNumber: {
        type: Sequelize.STRING
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
        type: Sequelize.STRING,
        allowNull: false
    },
    salt: {
        type: Sequelize.STRING
    },
    springFrostDate: {
        type: Sequelize.DATE
    },
    wishlist: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
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
        beforeValidate: function (user) {
            user.email = user.email.toLowerCase();  // RESOLVES CASE SENSITIVE-EMAIL ISSUE PT (1/2)
            // let's not have this validation for now, it breaks heroku's ability to seed
            // if (user.zip.length > 5) user.zip = user.zip.substr(0, 5);  // IN CASE OF 9-DIGIT ZIP
        },
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
