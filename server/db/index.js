'use strict';
var db = require('./_db');
module.exports = db;

var User = require('./models/user');
var Plant = require('./models/plant');

User.belongsToMany(Plant, {through: 'Plot'});
Plant.belongsToMany(User, {through: 'Plot'});
